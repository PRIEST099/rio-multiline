import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import HeroAbout from "../assets/HeroAbout.png";

const AboutUsHero = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  // Animation variants for the blue diagonal section
  const diagonalVariants = {
    hidden: { 
      opacity: 0,
      x: -100,
      skewX: 0
    },
    visible: { 
      opacity: 1,
      x: 0,
      skewX: -6,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.610, 0.355, 1.000]
      }
    }
  };

  // Animation variants for the content
  const contentVariants = {
    hidden: { 
      opacity: 0,
      y: 30
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for the image
  const imageVariants = {
    hidden: { 
      opacity: 0,
      scale: 1.1
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.8,
        ease: [0.215, 0.610, 0.355, 1.000]
      }
    }
  };

  // Animation variant for breadcrumb items
  const breadcrumbVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.6,
        duration: 0.4
      }
    }
  };

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[320px] lg:h-80">
        {/* Left Section with diagonal cut */}
        <div className="relative w-full lg:w-5/12 lg:-mr-20">
          <motion.div 
            className="absolute inset-0 bg-blue-600 lg:origin-top-right lg:scale-125"
            initial="hidden"
            animate="visible"
            variants={diagonalVariants}
          />
          
          <motion.div 
            className="relative z-10 h-full flex flex-col justify-start p-4 sm:p-6 lg:p-8"
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <nav aria-label="Breadcrumb" className="flex items-center text-white space-x-1 text-sm mb-8 lg:mb-16">
              <motion.a 
                href="/" 
                className="hover:text-blue-100 transition-colors py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                variants={breadcrumbVariants}
              >
                Home
              </motion.a>
              <motion.span 
                className="mx-2"
                variants={breadcrumbVariants}
              >
                /
              </motion.span>
              <motion.a 
                href="/about" 
                className={`hover:text-blue-100 transition-colors py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
                  isAboutPage ? 'border-b-2 border-white text-white font-bold text-lg' : ''
                }`}
                variants={breadcrumbVariants}
              >
                About
              </motion.a>
            </nav>
            
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
            >
              Overview
            </motion.h1>
          </motion.div>
        </div>

        {/* Animated right section - Ship Image */}
        <motion.div 
          className="w-full lg:w-8/12 h-48 sm:h-64 lg:h-full"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <img
            src={HeroAbout}
            alt="Container ship on ocean"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsHero;