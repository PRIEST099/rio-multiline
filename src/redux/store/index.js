import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import publicBlogReducer from '../features/BlogsSlice'; // Assuming this is your existing import

// Configure the store
const store = configureStore({
  reducer: {
    publicBlog: publicBlogReducer, // Add the publicBlog reducer
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();
    if (process.env.NODE_ENV === 'development') {
      return middleware.concat(logger);
    }
    return middleware;
  },
});

export default store;