import React, { useState } from 'react';
import { motion } from 'framer-motion';
import herobackground from "../assets/herobackground.jpeg";
import heroiconsbackground from "../assets/heroiconsbackground.png";
import { useFormModal } from "../context/FormModalContext";

const Hero = () => {
  const [trackId, setTrackId] = useState('');
  const { openForm } = useFormModal() || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tracking ID:', trackId);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const clipPathVariants = {
    hidden: { clipPath: 'polygon(100% 0, 100% 0, 100% 100%)' },
    visible: {
      clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
      transition: {
        duration: 1.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background layers */}
      <div className="absolute inset-0">
        <motion.div 
          className="w-full h-full bg-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute top-0 right-0 lg:w-1/2 w-full h-full hidden lg:block"
          initial="hidden"
          animate="visible"
          variants={clipPathVariants}
          style={{
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
          }}
        >
          <img 
            src={herobackground} 
            alt="Shipping containers" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-6 lg:py-12 flex items-center min-h-screen">
        <motion.div 
          className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 mt-24 lg:mt-32"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="lg:col-span-7 text-white order-2 lg:order-1">
            <motion.h1 
              className="text-3xl lg:text-5xl font-bold mt-6 lg:mt-12"
              variants={itemVariants}
            >
              Trusted China-to-Rwanda Shipping Solutions
            </motion.h1>
            <motion.p 
              className="mt-4 lg:mt-6 text-base lg:text-lg"
              variants={itemVariants}
            >
              Streamline your logistics with our reliable, fast, and cost-effective shipping services.
              From warehouses to clearance, we've got you covered.
            </motion.p>
            
            {/* Icons diagram */}
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <img 
                src={heroiconsbackground} 
                alt="Shipping process diagram"
                className="max-w-full w-auto h-auto"
              />
            </motion.div>
          </div>

          <motion.div 
            className="lg:col-span-5 order-1 lg:order-2 w-full"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-primary bg-opacity-80 p-6 lg:p-8 rounded-xl backdrop-blur-sm shadow-lg">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">
                QUICK LINKS
              </h2>
              <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="trackId" className="block text-white text-sm mb-2">
                      Try our seamless service helpdesk
                    </label>
                    {/* <input
                      type="text"
                      id="trackId"
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      className="w-full px-4 py-3 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your tracking ID"
                    /> */}
                  </div>
                  {/* <motion.button
                    type="submit"
                    className="w-full bg-secondary hover:bg-red-900 text-white py-3 rounded-md 
                             font-semibold transition-colors duration-200 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Track Now
                  </motion.button> */}
                  <motion.button
                    type="button"
                    onClick={() => openForm?.("flight")}
                    className="w-full bg-secondary hover:bg-secondary-600 text-white py-3 rounded-md 
                             font-semibold transition-colors duration-200 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    BOOK A FLIGHT WITH US
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => openForm?.("logistics")}
                    className="w-full bg-secondary hover:bg-secondary-600 text-white py-3 rounded-md 
                             font-semibold transition-colors duration-200 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    REQUEST QUOTATION
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;