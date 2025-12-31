 import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { likeBlog, shareBlog } from '../redux/features/BlogsSlice';

const BlogCard = ({ blog }) => {
  const dispatch = useDispatch();
  const { interactionLoading, interactionError } = useSelector((state) => state.publicBlog);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(likeBlog(blog._id));
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(shareBlog(blog._id));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const extractTextFromHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent.slice(0, 120) + '...';
  };

  const coverImage = blog.images && blog.images.length > 0 ? blog.images[0] : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 max-w-sm mx-auto transform hover:-translate-y-1">
      {/* Image Container */}
      {coverImage && (
        <div className="relative h-52 overflow-hidden">
          <img
            src={coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
          {/* Date Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
            {formatDate(blog.createdAt)}
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className="p-5">
        {/* Categories */}
        {blog.categories && blog.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.categories.map((category) => (
              <span
                key={category}
                className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium transition-colors hover:bg-indigo-100"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
          <Link to={`/blogs/${blog._id}`} className="block">
            {blog.title}
          </Link>
        </h2>

        {/* Author */}
        <p className="text-gray-600 text-sm mb-4 flex items-center">
          <span className="font-medium text-gray-900">
            {blog.author?.username || 'Anonymous'}
          </span>
          {!coverImage && (
            <>
              <span className="mx-2 text-gray-400">•</span>
              <time className="text-gray-500">{formatDate(blog.createdAt)}</time>
            </>
          )}
        </p>

        {/* Summary */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">
          {blog.summary || extractTextFromHtml(blog.content)}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/blogs/${blog._id}`}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Read More
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          {/* Interaction Buttons */}
          <div className="flex gap-2">
            
          </div>
        </div>

        {/* Error Message */}
        {interactionError[blog._id] && (
          <p className="text-red-500 text-xs mt-3 bg-red-50 p-2 rounded-md">
            {interactionError[blog._id]}
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogCard;