import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublishedBlogs, setCurrentPage } from '../redux/features/BlogsSlice';
import DOMPurify from 'dompurify';
import BlogCard from './BlogCard';
import Pagination from './Pagination';
import Navbar from "../components/Navbar";

const BlogsList = () => {
  const dispatch = useDispatch();
  const { publishedBlogs, loading, error, total, totalPages, currentPage } = useSelector(
    (state) => state.publicBlog
  );
  
  const [slideIndex, setSlideIndex] = useState(0);
  const latestBlogs = publishedBlogs.slice(0, 3);
  const hasSlides = latestBlogs.length > 0;

  useEffect(() => {
    dispatch(getPublishedBlogs({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (!hasSlides || latestBlogs.length === 1) return;
    
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % latestBlogs.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [hasSlides, latestBlogs.length]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDotClick = (index) => {
    setSlideIndex(index);
  };

  const sanitizeHTML = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  if (loading && !publishedBlogs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 animate-pulse text-lg">Loading blogs...</div>
      </div>
    );
  }

  if (error && !publishedBlogs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {hasSlides && (
          <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden bg-gray-900">
            <div className="relative h-full">
              {latestBlogs.map((blog, index) => (
                <div
                  key={blog._id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === slideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  aria-hidden={index !== slideIndex}
                >
                  <img
                    src={blog.images?.[0] || 'https://via.placeholder.com/1200x600'}
                    alt={blog.title}
                    className="w-full h-full object-cover select-none"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 text-white">
                    <div className="max-w-3xl mx-auto text-center">
                      <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-4 backdrop-blur-sm">
                        Featured Post
                      </span>
                      <h2
                        className="text-2xl sm:text-4xl font-bold mb-3 line-clamp-2"
                        dangerouslySetInnerHTML={sanitizeHTML(
                          `<a href="/blogs/${blog._id}" class="hover:underline focus:outline-none focus:ring-2 focus:ring-white/50">${blog.title}</a>`
                        )}
                      />
                      <p
                        className="text-sm sm:text-lg opacity-90 mb-6 line-clamp-2 hidden sm:block"
                        dangerouslySetInnerHTML={sanitizeHTML(blog.summary || blog.content.slice(0, 150) + '...')}
                      />
                      <a
                        href={`/blogs/${blog._id}`}
                        className="inline-block bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        Read Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {latestBlogs.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2" role="tablist">
                {latestBlogs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 ${
                      index === slideIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-selected={index === slideIndex}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading && publishedBlogs.length > 0 && (
            <div className="text-center mb-4 text-gray-500 text-sm animate-pulse">
              Updating blog list...
            </div>
          )}

          {publishedBlogs.length === 0 ? (
            <div className="text-center py-16 text-gray-600 bg-white rounded-lg shadow-sm">
              <p className="text-lg sm:text-xl">No blog posts available yet</p>
              <p className="text-sm mt-2">Check back later for new content!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {publishedBlogs.map((blog) =>
                  blog?._id ? (
                    <BlogCard 
                      key={blog._id} 
                      blog={blog} 
                    />
                  ) : null
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages} ({total} posts)
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogsList;