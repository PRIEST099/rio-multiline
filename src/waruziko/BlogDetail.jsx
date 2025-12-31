import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicBlogById, likeBlog, shareBlog, getComments } from '../redux/features/BlogsSlice';
import Navbar from '../components/Navbar';

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBlog, loading, error, interactionLoading, interactionError } = useSelector(
    (state) => state.publicBlog
  );

  const [imageIndex, setImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getPublicBlogById(id));
      dispatch(getComments(id));
    }
  }, [dispatch, id]);

  // Auto-slide effect for gallery images
  useEffect(() => {
    if (!isFullscreen && currentBlog?.images?.length > 1) {
      const interval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % currentBlog.images.length);
      }, 5000); // Change image every 5 seconds
      return () => clearInterval(interval);
    }
  }, [currentBlog?.images, isFullscreen]);

  const handleLike = () => {
    dispatch(likeBlog(id));
  };

  const handleShare = () => {
    dispatch(shareBlog(id));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev === 0 ? (currentBlog.images.length - 1) : prev - 1));
  };

  const handleNextImage = () => {
    setImageIndex((prev) => (prev + 1) % currentBlog.images.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading && !currentBlog) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <Link to="/blogs" className="underline mt-2 inline-block">Back</Link>
        </div>
      </div>
    );
  }

  if (!currentBlog) return null;

  const coverImage = currentBlog.images && currentBlog.images.length > 0 ? currentBlog.images[0] : null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-12">
        <Link to="/blogs" className="inline-flex items-center text-blue-600 mb-6 transition hover:text-blue-800">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back 
        </Link>
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {coverImage && (
            <div className="h-64 sm:h-96 w-full overflow-hidden">
              <img 
                src={coverImage} 
                alt={currentBlog.title} 
                className="w-full h-full object-cover transition duration-500 hover:scale-105" 
              />
            </div>
          )}
          <div className="p-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">{currentBlog.title}</h1>
            <div className="flex flex-wrap items-center text-gray-600 mb-6">
              {currentBlog.author && (
                <div className="flex items-center mr-6 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-2 shadow-md">
                    <span className="text-white font-bold">
                      {currentBlog.author.fullName?.charAt(0) || 'A'}
                    </span>
                  </div>
                  {/* <span>By {currentBlog.author.fullName || 'Anonymous'}</span> */}
                </div>
              )}
              <div className="mr-6 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                </svg>
                <time dateTime={currentBlog.createdAt}>{formatDate(currentBlog.createdAt)}</time>
              </div>
              {currentBlog.categories && currentBlog.categories.length > 0 && (
                <div className="mb-2">
                  {currentBlog.categories.map((category) => (
                    category && (
                      <span key={category} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mr-2 shadow-sm transition hover:bg-blue-200">
                        {category}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
            <div
              className="prose lg:prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: currentBlog.content }}
            ></div>
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Interaction buttons would go here */}
              </div>
              {interactionError[id] && <p className="text-red-500 mt-2">{interactionError[id]}</p>}
            </div>

            {/* Enhanced Gallery Section */}
            {currentBlog.images && currentBlog.images.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                  </svg>
                  Photo Gallery
                </h2>
                
                {/* Fullscreen gallery modal */}
                {isFullscreen && (
                  <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center p-4">
                    <div className="relative w-full max-w-6xl max-h-screen">
                      <button 
                        onClick={toggleFullscreen}
                        className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition z-10"
                        aria-label="Close fullscreen gallery"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                      
                      <div className="relative h-full flex items-center justify-center">
                        <img
                          src={currentBlog.images[imageIndex]}
                          alt={`${currentBlog.title} - Gallery Image ${imageIndex + 1}`}
                          className="max-h-screen max-w-full object-contain"
                        />
                        
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition"
                          aria-label="Previous image"
                        >
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                          </svg>
                        </button>
                        
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition"
                          aria-label="Next image"
                        >
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="absolute bottom-4 left-0 right-0">
                        <div className="flex justify-center items-center">
                          <p className="text-white bg-black bg-opacity-60 px-3 py-1 rounded-full text-sm">
                            {imageIndex + 1} / {currentBlog.images.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Main gallery display */}
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <div className="aspect-w-16 aspect-h-9 sm:aspect-h-7 md:aspect-h-5 lg:aspect-h-9">
                    <img
                      src={currentBlog.images[imageIndex]}
                      alt={`${currentBlog.title} - Gallery Image ${imageIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  {/* Gallery controls */}
                  <div className="absolute inset-0 flex items-center justify-between p-2 md:p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={handlePrevImage}
                      className="p-1 sm:p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition transform hover:scale-110"
                      aria-label="Previous image"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    
                    <button
                      onClick={toggleFullscreen}
                      className="p-1 sm:p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition transform hover:scale-110"
                      aria-label="View fullscreen"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
                      </svg>
                    </button>
                    
                    <button
                      onClick={handleNextImage}
                      className="p-1 sm:p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition transform hover:scale-110"
                      aria-label="Next image"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded">
                    {imageIndex + 1} / {currentBlog.images.length}
                  </div>
                </div>
                
                {/* Thumbnail navigation */}
                {currentBlog.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {currentBlog.images.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setImageIndex(idx)}
                        className={`relative rounded overflow-hidden aspect-square transition ${
                          idx === imageIndex ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                        aria-pressed={idx === imageIndex}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Indicator dots for mobile */}
                <div className="mt-4 flex justify-center gap-2 md:hidden">
                  {currentBlog.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors focus:outline-none ${
                        idx === imageIndex ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                      aria-selected={idx === imageIndex}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogDetail;