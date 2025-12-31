import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../redux/features/BlogsSlice';

const CommentSection = ({ blogId }) => {
  const dispatch = useDispatch();
  const { comments, interactionLoading, interactionError } = useSelector((state) => state.publicBlog);
  const [commentContent, setCommentContent] = useState('');
  const blogComments = comments[blogId] || [];

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      dispatch(addComment({ blogId, content: commentContent }));
      setCommentContent('');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments ({blogComments.length})</h2>
      <form onSubmit={handleSubmitComment} className="mb-10">
        <div className="mb-4">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment..."
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={interactionLoading[blogId]}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {interactionLoading[blogId] ? 'Posting...' : 'Post Comment'}
        </button>
        {interactionError[blogId] && (
          <p className="text-red-500 mt-2">{interactionError[blogId]}</p>
        )}
      </form>
      {blogComments.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogComments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-gray-500 font-bold">A</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-800">Anonymous</h4>
                    <time className="text-sm text-gray-500" dateTime={comment.createdAt}>
                      {formatDate(comment.createdAt)}
                    </time>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;