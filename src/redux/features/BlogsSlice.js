import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Async Thunks
export const likeBlog = createAsyncThunk(
  'publicBlog/like',
  async (id, { rejectWithValue }) => {
    try {
      if (!id || id === 'null' || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid blog ID');
      }
      const response = await axios.post(`${API_URL}/blogs/${id}/like`, {});
      console.log('Like blog response:', response.data);
      return { ...response.data, blogId: id };
    } catch (error) {
      console.error('Like blog error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const shareBlog = createAsyncThunk(
  'publicBlog/share',
  async (id, { rejectWithValue }) => {
    try {
      if (!id || id === 'null' || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid blog ID');
      }
      const response = await axios.post(`${API_URL}/blogs/${id}/share`, {});
      const blogUrl = `${window.location.origin}/blogs/${id}`;
      console.log('Share blog response:', response.data);
      return { ...response.data, blogId: id, blogUrl };
    } catch (error) {
      console.error('Share blog error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getPublishedBlogs = createAsyncThunk(
  'publicBlog/getPublished',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_URL}/blogs/published${queryParams ? `?${queryParams}` : ''}`;
      console.log('Fetching published blogs from:', url); // Debug URL
      const response = await axios.get(url);
      console.log('Published blogs response:', response.data);
      return {
        posts: response.data,
        total: response.data.length,
        totalPages: 1,
        currentPage: params.page || 1,
      };
    } catch (error) {
      console.error('Get published blogs error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getPublicBlogById = createAsyncThunk(
  'publicBlog/getById',
  async (id, { rejectWithValue }) => {
    try {
      if (!id || id === 'null' || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid blog ID');
      }
      const response = await axios.get(`${API_URL}/blogs/${id}`);
      console.log('Get blog by ID response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get blog by ID error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addComment = createAsyncThunk(
  'publicBlog/addComment',
  async ({ blogId, content }, { rejectWithValue }) => {
    try {
      if (!blogId || blogId === 'null' || !blogId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid blog ID');
      }
      const response = await axios.post(`${API_URL}/blogs/${blogId}/comments`, { content });
      console.log('Add comment response:', response.data);
      return { ...response.data, blogId };
    } catch (error) {
      console.error('Add comment error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getComments = createAsyncThunk(
  'publicBlog/getComments',
  async (blogId, { rejectWithValue }) => {
    try {
      if (!blogId || blogId === 'null' || !blogId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid blog ID');
      }
      const response = await axios.get(`${API_URL}/blogs/${blogId}/comments`);
      console.log('Get comments response:', response.data);
      return { comments: response.data, blogId };
    } catch (error) {
      console.error('Get comments error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const publicBlogSlice = createSlice({
  name: 'publicBlog',
  initialState: {
    publishedBlogs: [],
    currentBlog: null,
    comments: {},
    total: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
    success: false,
    message: '',
    interactionLoading: {},
    interactionError: {},
    shareNotification: null,
  },
  reducers: {
    resetPublicBlogState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
      state.interactionLoading = {};
      state.interactionError = {};
      state.shareNotification = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearShareNotification: (state) => {
      state.shareNotification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Published Blogs
      .addCase(getPublishedBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublishedBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.publishedBlogs = action.payload.posts || [];
        state.total = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.error = null;
      })
      .addCase(getPublishedBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch published blogs';
        state.publishedBlogs = [];
      })
      // Get Blog by ID
      .addCase(getPublicBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
        state.error = null;
      })
      .addCase(getPublicBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch blog';
      })
      // Like Blog
      .addCase(likeBlog.pending, (state, action) => {
        state.interactionLoading[action.meta.arg] = true;
        state.interactionError[action.meta.arg] = null;
        if (state.currentBlog && state.currentBlog._id === action.meta.arg) {
          state.currentBlog.likes = (state.currentBlog.likes || 0) + 1;
        }
        state.publishedBlogs = state.publishedBlogs.map((blog) =>
          blog._id === action.meta.arg ? { ...blog, likes: (blog.likes || 0) + 1 } : blog
        );
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        state.interactionLoading[action.payload.blogId] = false;
        state.success = true;
        if (state.currentBlog && state.currentBlog._id === action.payload.blogId) {
          state.currentBlog = action.payload;
        }
        state.publishedBlogs = state.publishedBlogs.map((blog) =>
          blog._id === action.payload.blogId ? action.payload : blog
        );
      })
      .addCase(likeBlog.rejected, (state, action) => {
        state.interactionLoading[action.meta.arg] = false;
        state.interactionError[action.meta.arg] = action.payload?.message || 'Failed to like blog';
        if (state.currentBlog && state.currentBlog._id === action.meta.arg) {
          state.currentBlog.likes = (state.currentBlog.likes || 1) - 1;
        }
        state.publishedBlogs = state.publishedBlogs.map((blog) =>
          blog._id === action.meta.arg ? { ...blog, likes: (blog.likes || 1) - 1 } : blog
        );
      })
      // Share Blog
      .addCase(shareBlog.pending, (state, action) => {
        state.interactionLoading[action.meta.arg] = true;
        state.interactionError[action.meta.arg] = null;
      })
      .addCase(shareBlog.fulfilled, (state, action) => {
        state.interactionLoading[action.payload.blogId] = false;
        state.success = true;
        state.shareNotification = `Link copied: ${action.payload.blogUrl}`;
        navigator.clipboard.writeText(action.payload.blogUrl).catch((err) => {
          console.error('Failed to copy link:', err);
          state.shareNotification = 'Failed to copy link';
        });
      })
      .addCase(shareBlog.rejected, (state, action) => {
        state.interactionLoading[action.meta.arg] = false;
        state.interactionError[action.meta.arg] = action.payload?.message || 'Failed to share blog';
      })
      // Add Comment
      .addCase(addComment.pending, (state, action) => {
        state.interactionLoading[action.meta.arg.blogId] = true;
        state.interactionError[action.meta.arg.blogId] = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.interactionLoading[action.payload.blogId] = false;
        state.success = true;
        const blogId = action.payload.blogId;
        if (!state.comments[blogId]) state.comments[blogId] = [];
        state.comments[blogId].unshift(action.payload);
        if (state.currentBlog && state.currentBlog._id === blogId) {
          state.currentBlog.commentsCount = (state.currentBlog.commentsCount || 0) + 1;
        }
        state.publishedBlogs = state.publishedBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, commentsCount: (blog.commentsCount || 0) + 1 } : blog
        );
      })
      .addCase(addComment.rejected, (state, action) => {
        state.interactionLoading[action.meta.arg.blogId] = false;
        state.interactionError[action.meta.arg.blogId] = action.payload?.message || 'Failed to add comment';
      })
      // Get Comments
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments[action.payload.blogId] = action.payload.comments;
        state.error = null;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch comments';
      });
  },
});

export const { resetPublicBlogState, setCurrentPage, clearShareNotification } = publicBlogSlice.actions;
export default publicBlogSlice.reducer;