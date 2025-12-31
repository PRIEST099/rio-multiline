import React from "react";
import { motion } from "framer-motion";
import { GiAirplaneDeparture } from "react-icons/gi";
import { FaShippingFast, FaTruckMoving } from "react-icons/fa";
import { AiOutlineCloudServer } from "react-icons/ai";
import { MdOutlineInventory2, MdAssignmentReturn, MdWarehouse } from "react-icons/md";
import { BiTransferAlt } from "react-icons/bi";
import { BsCurrencyDollar } from "react-icons/bs";

const AnimatedIcon = ({ icon: Icon, className }) => {
  const iconVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      x: [0, 10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={iconVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Icon size={28} />
    </motion.div>
  );
};

const ServiceCard = ({ title, items, bgColor }) => {
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <motion.div 
      className={`${bgColor} text-white p-6 rounded-lg`}
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <motion.ul className="space-y-4">
        {items.map((item, index) => (
          <motion.li 
            key={index}
            className="flex items-center group"
            variants={listItemVariants}
          >
            <AnimatedIcon 
              icon={item.icon} 
              className="mr-4 transition-transform duration-300 group-hover:translate-x-2"
            />
            <span>{item.text}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

function Services() {
  const services = [
    {
      title: "FORWARDING",
      bgColor: "bg-Secondary",
      items: [
        { icon: GiAirplaneDeparture, text: "Air Freight" },
        { icon: FaShippingFast, text: "Ocean Freight" },
        { icon: FaTruckMoving, text: "Trucking" },
        { icon: AiOutlineCloudServer, text: "RIO Booking" }
      ]
    },
    {
      title: "FULFILLMENT",
      bgColor: "bg-primary",
      items: [
        { icon: MdWarehouse, text: "B2B Fulfillment" },
        { icon: MdOutlineInventory2, text: "Warehouse Network" },
        { icon: BiTransferAlt, text: "Packaging" },
        { icon: MdAssignmentReturn, text: "Returns" }
      ]
    },
    {
      title: "CONTROL TOWER",
      bgColor: "bg-Secondary",
      items: [
        { icon: MdOutlineInventory2, text: "Booking Management" },
        { icon: BiTransferAlt, text: "Carbon Control" },
        { icon: FaTruckMoving, text: "Order Management" },
        { icon: BsCurrencyDollar, text: "Buyer's Consolidation" }
      ]
    },
    {
      title: "CUSTOMS AND FINANCIAL SERVICE",
      bgColor: "bg-primary",
      items: [
        { icon: MdOutlineInventory2, text: "Customs" },
        { icon: BsCurrencyDollar, text: "Trade Finance" },
        { icon: FaShippingFast, text: "Duty Drawback" },
        { icon: BiTransferAlt, text: "Insurance" }
      ]
    },
    {
      title: "FLIGHT TICKETING",
      bgColor: "bg-Secondary",
      items: [
        { icon: GiAirplaneDeparture, text: "Book itineraries with cabin & seat prefs" },
        { icon: MdOutlineInventory2, text: "Capture passenger & passport details" },
        { icon: BiTransferAlt, text: "Admin notified via WhatsApp" },
        { icon: BsCurrencyDollar, text: "Payment, billing, and confirmation flow" }
      ]
    },
    {
      title: "LOGISTICS QUOTATION",
      bgColor: "bg-primary",
      items: [
        { icon: FaShippingFast, text: "Door-to-door or port-to-port options" },
        { icon: MdOutlineInventory2, text: "Cargo details, dimensions, and volume" },
        { icon: MdWarehouse, text: "Pickup & delivery scheduling with insurance" },
        { icon: BiTransferAlt, text: "Admin notified  with Your information" }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <div id="services-section" className="container mx-auto my-12 lg:my-16 px-4 lg:px-0">
      <motion.h1 
        className="text-4xl lg:text-5xl text-center font-bold mb-8 lg:mb-12 text-primary"
        initial="hidden"
        animate="visible"
        variants={titleVariants}
      >
        Our <span className="text-Secondary">Services</span>
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((service, idx) => (
          <ServiceCard 
            key={service.title}
            title={service.title}
            items={service.items}
            bgColor={service.bgColor}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default Services;