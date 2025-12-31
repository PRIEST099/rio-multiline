import React from 'react';
import { motion } from 'framer-motion';
import { SlCalender } from "react-icons/sl";
import { GiCargoCrate, GiCargoCrane } from "react-icons/gi";
import { IoMdTimer } from "react-icons/io";

const cardData = [
  { year: "2019", description: "Established.", icon: <SlCalender size={40} /> },
  { year: "+750", description: "Container shipped.", icon: <GiCargoCrate size={40} /> },
  { year: "+5", description: "Ports Served", icon: <GiCargoCrane size={40} /> },
  { year: "24/7", description: "Operation.", icon: <IoMdTimer size={40} /> }
];

function EstablishedPort() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const iconVariants = {
    hidden: { 
      scale: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <div className="w-full bg-primary py-10 mt-16">
      <motion.div 
        className="flex flex-wrap justify-center gap-6 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cardData.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center bg-white shadow-lg border rounded-lg w-72 p-6 text-center"
          >
            <motion.div 
              className="flex justify-center items-center w-16 h-16 rounded-full bg-Secondary text-white mb-4"
              variants={iconVariants}
              whileHover={{ 
                rotate: 360,
                transition: { duration: 0.8 }
              }}
            >
              {card.icon}
            </motion.div>
            <motion.h5 
              className="text-black text-2xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {card.year}
            </motion.h5>
            <motion.p 
              className="text-black text-base leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {card.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default EstablishedPort;