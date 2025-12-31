import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function OurPort() {
  const [selectedPort, setSelectedPort] = useState('Kigali, Rwanda');

  const mapLinks = {
    'Kigali, Rwanda': 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12080.73732861526!2d29.7343437!3d-1.9402774!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMDA2JzEwLjAiTiA3NMKwMjUnMzcuNyJX!5e0!3m2!1sen!2sus!4v1648482801994!5m2!1sen!2sus',
    'Mombasa, Kenya': 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31450.858775665353!2d39.6572182!3d-4.043475!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18400afac6788767%3A0x253f62bfc5ba66d8!2zTW9tYmFzYQ!5e0!3m2!1sen!2sus!4v1648482801994!5m2!1sen!2sus',
    'Dar es Salaam, Tanzania': 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13179.413264559118!2d39.2684189!3d-6.7923265!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184f7d8c3c283319%3A0x943cbf5fdab1844f!2zRGFyc2FsYW0sIFRheXphbmE!5e0!3m2!1sen!2sus!4v1648482801994!5m2!1sen!2sus',
  };

  const handleSelectPort = (port) => {
    setSelectedPort(port);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const mapVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="mt-16 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Title */}
      <motion.h1 
        className="text-center text-4xl font-extrabold mb-10 text-primary"
        variants={titleVariants}
      >
        Our Major Ports  <span className='text-Secondary'>Of Origin</span>
      </motion.h1>

      <div className="flex flex-col lg:flex-row justify-center items-center my-10">
        {/* Left Side - Port Selection */}
        <motion.div 
          className="lg:w-1/3 w-full mb-8 lg:mb-0 mx-16"
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl font-bold mb-4"
            variants={titleVariants}
          >
            Select Your Port
          </motion.h2>
          <div className="space-y-4">
            {Object.keys(mapLinks).map((port) => (
              <motion.button
                key={port}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`w-full py-3 px-4 text-left rounded-lg ${
                  selectedPort === port 
                    ? 'bg-primary text-white' 
                    : 'bg-primary/5 text-black hover:bg-primary/10'
                } transition-all`}
                onClick={() => handleSelectPort(port)}
              >
                {port}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Google Map */}
        <motion.div 
          className="lg:w-2/3 w-full mx-16"
          variants={containerVariants}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPort}
              variants={mapVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg border-b"
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={mapLinks[selectedPort]}
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
                title={`Map of ${selectedPort}`}
              ></iframe>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default OurPort;