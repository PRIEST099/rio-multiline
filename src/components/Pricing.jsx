import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Ship, Package, Box, Warehouse, Beaker } from 'lucide-react';

const PricingCard = ({ title, description, icon: Icon, data }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 p-8"
  >
    <motion.div 
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-3 mb-8"
    >
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className="p-3 rounded-lg bg-blue-100"
      >
        <Icon className="w-8 h-8 text-blue-600" />
      </motion.div>
      <div>
        <h3 className="text-2xl font-semibold">{title}</h3>
        {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
      </div>
    </motion.div>
    <div className="space-y-4">
      {data.map((item, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex justify-between items-center py-3 border-b border-gray-100"
        >
          <span className="text-gray-600">{item.label}</span>
          <div className="text-right">
            <div className="font-medium text-blue-600">{item.value}</div>
            {item.time && <div className="text-sm text-gray-500">{item.time}</div>}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Pricing = () => {
  const [activeTab, setActiveTab] = useState("air");
  
  const airData = {
    normal: [
      { label: "Express (Any Quantity)", value: "$16", time: "3-5 days (express)" },
      { label: "Below 45kg", value: "$13", time: "7 days" },
      { label: "45kg-100kg", value: "$11", time: "7 days" },
      { label: "100kg+", value: "$10", time: "7 days" }
    ],
    special: [
      { label: "Any Quantity", value: "$15/kg", time: "2 weeks" }
    ]
  };

  const seaData = {
    consolidation: [
      { label: "Guangzhou to Kigali", value: "$152/cbm", time: "35 days" }
    ],
    container20: [
      { label: "Qingdao → Mombasa", value: "USD 1300", time: "22 days" },
      { label: "Qingdao → Dar es Salaam", value: "USD 1400", time: "26 days" },
      { label: "Ningbo → Mombasa", value: "USD 1100", time: "35 days" },
      { label: "Ningbo → Dar es Salaam", value: "USD 1303", time: "45 days" },
      { label: "Foshan → Mombasa", value: "USD 1350", time: "18 days" },
      { label: "Foshan → Dar es Salaam", value: "USD 1400", time: "23 days" },
      { label: "Nansha → Mombasa", value: "USD 1250", time: "18 days" },
      { label: "Nansha → Dar es Salaam", value: "USD 1350", time: "32 days" }
    ],
    container40: [
      { label: "Qingdao → Mombasa", value: "USD 1450", time: "22 days" },
      { label: "Qingdao → Dar es Salaam", value: "USD 1600", time: "26 days" },
      { label: "Ningbo → Mombasa", value: "USD 1203", time: "35 days" },
      { label: "Ningbo → Dar es Salaam", value: "USD 1503", time: "45 days" },
      { label: "Foshan → Mombasa", value: "USD 1400", time: "18 days" },
      { label: "Foshan → Dar es Salaam", value: "USD 1450", time: "36 days" },
      { label: "Nansha → Mombasa", value: "USD 1403", time: "20 days" },
      { label: "Nansha → Dar es Salaam", value: "USD 1500", time: "32 days" }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1440px] mx-auto p-8  min-h-screen"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold mb-4 text-primary">Choose a shipping  <span className='text-Secondary'>plan that's right for you</span></h1>
        <p className="text-xl text-gray-600">Get transparent pricing for all your shipping needs</p>
      </motion.div>

      <div className="w-full">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white border border-gray-200 rounded-lg shadow-sm">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("air")}
              className={`flex items-center px-12 py-4 rounded-l-lg text-lg font-medium transition-colors ${
                activeTab === "air"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Plane className="w-5 h-5 mr-2" />
              By Air
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("sea")}
              className={`flex items-center px-12 py-4 rounded-r-lg text-lg font-medium transition-colors ${
                activeTab === "sea"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Ship className="w-5 h-5 mr-2" />
              By Sea
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "air" && (
            <motion.div 
              key="air"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <PricingCard 
                title="Normal Products" 
                icon={Package} 
                data={airData.normal} 
              />
              <PricingCard 
                title="Special Products" 
                description="Batteries, chemicals, medical products, liquids and foods"
                icon={Beaker} 
                data={airData.special} 
              />
            </motion.div>
          )}

          {activeTab === "sea" && (
            <motion.div 
              key="sea"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <PricingCard 
                title="Consolidation/Groupage" 
                icon={Warehouse} 
                data={seaData.consolidation} 
              />
              <PricingCard 
                title="20ft Container" 
                icon={Box} 
                data={seaData.container20} 
              />
              <PricingCard 
                title="40ft HQ Container" 
                icon={Box} 
                data={seaData.container40} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Pricing;