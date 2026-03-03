import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const NotFound = () => {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Animate heading and image on component mount
    gsap.from(headingRef.current, { y: -50, opacity: 0, duration: 1 });
    gsap.from(imageRef.current, { scale: 0.5, opacity: 0, duration: 1, delay: 0.2 });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="mb-6">
          <img
            ref={imageRef}
            src={require('../assets/not-found.png')}
            alt="404 Not Found"
            className="w-96 mx-auto"
          />
        </div>
        <h1
          ref={headingRef}
          className="text-4xl font-bold text-gray-800 mb-4"
          aria-label="Page Not Found"
        >
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          aria-label="Go back to home page"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
