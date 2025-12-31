import React from 'react';
import { motion } from 'framer-motion';
import AboutUsHero from '../components/AboutUsHero';
import warehouse from "../assets/warehousenew.png";
import shippingabout from "../assets/cargoship.png";
import Footer from '../components/Footer';

const About = () => {
  // Animation variants
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const fadeLeftVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const fadeRightVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
<>
<div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      <AboutUsHero />
      
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Title Section */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            About RIO
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* Warehouse Section */}
        <motion.div 
          className="relative mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
            {/* Warehouse Image */}
            <motion.div 
              className="w-full md:w-2/5 h-80 md:h-[500px] relative"
              variants={fadeLeftVariant}
            >
              <img
                src={warehouse}
                alt="Warehouse interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute right-0 bottom-0 w-12 h-12 bg-white hidden md:block"
                style={{
                  clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                }}
              />
            </motion.div>

            {/* Text Section */}
            <motion.div 
              className="w-full md:w-3/5 bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-16"
              variants={fadeRightVariant}
            >
              <p className="text-white text-xl md:text-2xl leading-relaxed font-light">
                RIO is a supply, sourcing, and logistics company that links Chinese manufacturers with Rwandan individuals, corporations, and businesses - from small enterprises to big brands - who want to buy or ship from China's mainland.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Description Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeLeftVariant}
          >
            <motion.p 
              className="text-gray-700 text-lg md:text-xl leading-relaxed"
              variants={fadeUpVariant}
            >
              Founded in 2018, RIO began as a local supplier and logistics provider of raw materials for various industries. Among our first clients were prominent companies like Uzuri Ky Ltd, and we quickly gained recognition for our reliable services 
            </motion.p>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <motion.p 
              className="text-gray-700 text-lg md:text-xl leading-relaxed"
              variants={fadeUpVariant}
            >
              By 2019, we expanded our operations to include sourcing, supplying, and managing logistics services between China and Rwanda, positioning ourselves as a trusted logistics broker. In 2022, we took a significant step forward by establishing our first office in Zhejiang Province, China and chenge model from from broker t shipping line. This milestone marked the beginning of our journey as a multinational logistics and supply chain company.
            </motion.p>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <motion.p 
              className="text-gray-700 text-lg md:text-xl leading-relaxed"
              variants={fadeUpVariant}
            >
              Today, we operate over six joint-venture warehouses across key commercial cities in China, providing seamless access to the busiest ports connecting China and Africa. To further enhance our services and professionalize our supply chain, we established a 240-square-meter office and showroom to showcase the diverse range of products we import from China. Our mission is clear is  to connect Rwanda with global trading partners in the most efficient, cost-effective, and professional manner possible.
            </motion.p>
          </motion.div>

          {/* Ship Image */}
          <motion.div 
            className="h-[600px] rounded-2xl overflow-hidden shadow-2xl relative group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeRightVariant}
          >
            <img 
              src={shippingabout}
              alt="Container ship"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        </div>
      </div>
    </div>
    <Footer/>
</>
  );
};

export default About;