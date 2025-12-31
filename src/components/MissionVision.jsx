import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MissionImage from '../assets/deliverytruck.png';

function MissionVision() {
  const [view, setView] = useState('mission');

  // Animation variants
  const imageVariants = {
    initial: { scale: 1.1, opacity: 0.7 },
    animate: {
      scale: 1,
      opacity: 0.85,
      transition: { duration: 0.8 },
    },
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="w-full h-[50vh] lg:h-[50vh] relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <motion.img
          src={MissionImage}
          alt="RIO mission and vision"
          className="w-full h-full object-cover"
          initial="initial"
          animate="animate"
          variants={imageVariants}
        />
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8 }}
        ></motion.div>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={view + '-title'}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide mb-4 text-center"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {view === 'mission' ? 'OUR MISSION' : 'OUR VISION'}
          </motion.h1>
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.p
            key={view + '-content'}
            className="text-center text-sm sm:text-base lg:text-lg xl:text-xl font-medium leading-relaxed max-w-4xl px-4 sm:px-8 lg:px-16"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {view === 'mission'
              ? 'To bridge the gap between Chinese manufacturers and Rwandan businesses by providing reliable, efficient, and affordable supply, shipping, and logistics solutions, fostering growth and trust in global trade.'
              : 'To revolutionize global trade by becoming the leading logistics and supply chain partner for businesses worldwide. We aim to empower businesses in emerging markets, particularly in Rwanda and Africa, by offering seamless access to high-quality Chinese-manufactured goods. Through our innovative supply chain solutions, transparent logistics operations, and dedicated customer service, we envision fostering long-term growth, sustainability, and trust in international trade relationships.'}
          </motion.p>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="flex gap-4 items-center mt-8">
          <motion.div
            onClick={() => setView('mission')}
            className={`h-4 w-4 rounded-full cursor-pointer ${
              view === 'mission' ? 'bg-Secondary' : 'bg-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          ></motion.div>
          <motion.div
            onClick={() => setView('vision')}
            className={`h-4 w-4 rounded-full cursor-pointer ${
              view === 'vision' ? 'bg-Secondary' : 'bg-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
}

export default MissionVision;
