import React from 'react';
import { motion } from 'framer-motion';
import { FaDollarSign, FaMapMarkerAlt, FaSmile, FaClock, FaTruck, FaHandshake } from 'react-icons/fa';
import BenefitImage from '../assets/images/ship.jpeg';

const Benefits = () => {
  // Card data with different icons
  const cards = [
    { 
      title: 'Transparent Pricing', 
      description: 'We provide clear and upfront pricing with no hidden fees, ensuring trust and confidence in all your transactions.',
      icon: <FaDollarSign size={40} />
    },
    { 
      title: 'Real-Time Tracking', 
      description: 'Stay updated with real-time tracking, giving you full visibility of your shipment from origin to destination.',
      icon: <FaMapMarkerAlt size={40} />
    },
    { 
      title: 'Satisfied Customers', 
      description: 'We prioritize customer satisfaction, delivering reliable services trusted by countless happy clients.',
      icon: <FaSmile size={40} />
    },
    { 
      title: '24/7 Access', 
      description: 'Our dedicated team is always available to assist you, ensuring a smooth and hassle-free experience.',
      icon: <FaClock size={40} />
    },
    { 
      title: 'On-Time Delivery', 
      description: 'We ensure your shipments arrive promptly, meeting deadlines with reliable and efficient service.',
      icon: <FaTruck size={40} />
    },
    { 
      title: 'Affordable Quality Services', 
      description: 'We deliver top-notch services tailored to your needs, all at competitive and budget-friendly rates.',
      icon: <FaHandshake size={40} />
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: (isLeft) => ({
      opacity: 0,
      x: isLeft ? -50 : 50
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center mt-16 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Section Title */}
      <motion.div 
        className="text-center"
        variants={titleVariants}
      >
        <h1 className="text-[24px] sm:text-[28px] md:text-[34px] font-bold text-primary">
          Reasons They Are  <span className="text-Secondary">Our Clients</span>
        </h1>
        <p className="max-w-lg text-base sm:text-lg md:text-xl mt-4">
          RIO delivers reliable, affordable, and efficient services. We prioritize timely delivery, exceptional customer care, and tailored solutions to meet your needs - your trusted partner in logistics excellence.
        </p>
      </motion.div>

      {/* Cards and Image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12 w-full px-4 md:px-8 lg:px-16">
        {/* Left Cards */}
        <div className="space-y-8 flex flex-col items-center">
          {cards.slice(0, 3).map((card, index) => (
            <motion.div
              key={index}
              custom={true}
              variants={cardVariants}
              className="h-auto w-full max-w-[400px] bg-primary/3 p-4 rounded-lg flex flex-col items-center justify-center text-center shadow-md"
            >
              <div className="w-16 h-16 bg-Secondary text-white rounded-full flex justify-center items-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-[22px] sm:text-[24px] md:text-[28px] font-bold">{card.title}</h3>
              <p className="text-sm sm:text-base md:text-lg">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Image */}
        <motion.div 
          className="flex justify-center items-center"
          variants={imageVariants}
        >
          <div
            className="w-full max-w-[450px] h-[250px] sm:h-[350px] md:h-[500px] lg:h-[650px] bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${BenefitImage})` }}>
          </div>
        </motion.div>

        {/* Right Cards */}
        <div className="space-y-8 flex flex-col items-center">
          {cards.slice(3).map((card, index) => (
            <motion.div
              key={index}
              custom={false}
              variants={cardVariants}
              className="h-auto w-full max-w-[400px] bg-primary/3 p-4 rounded-lg flex flex-col items-center justify-center text-center shadow-md"
            >
              <div className="w-16 h-16 bg-Secondary text-white rounded-full flex justify-center items-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-[22px] sm:text-[24px] md:text-[28px] font-bold">{card.title}</h3>
              <p className="text-sm sm:text-base md:text-lg">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Benefits;