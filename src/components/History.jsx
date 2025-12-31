import React from 'react';
import { motion } from 'framer-motion';
import { RiCustomerService2Line } from "react-icons/ri";
import { AiOutlineSolution } from "react-icons/ai";
import RioImage from '../assets/images/rio-1.jpg';
import supplyLogistic from '../assets/images/logistic and supply.jpg';

function History() {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
          variants={variants}
        >
          <h1 className="text-5xl font-bold text-primary mb-2">
            Our Company <span className="text-Secondary">History</span>
          </h1>
          <div className="h-1 w-24 bg-Secondary mx-auto"></div>
        </motion.div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-start">
          <motion.div 
            variants={variants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700">
                Founded in 2018, RIO began as a local supplier and logistics provider of raw materials for various industries. Among our first clients were prominent companies like Uzuri Ky Ltd, and we quickly gained recognition for our reliable services.
              </p>
              <p className="text-gray-700">
                By 2019, we expanded our operations to include sourcing, supplying, and managing logistics services between China and Rwanda, positioning ourselves as a trusted logistics broker. In 2022, we took a significant step forward by establishing our first office in Zhejiang Province, China and changed our model from broker to shipping line.
              </p>
              <p className="text-gray-700">
                Today, we operate over six joint-venture warehouses across key commercial cities in China, providing seamless access to the busiest ports connecting China and Africa. To further enhance our services and professionalize our supply chain, we established a 240-square-meter office and showroom to showcase the diverse range of products we import from China.
              </p>
              <p className="text-gray-800 font-medium">
                Our mission is clear: to connect Rwanda with global trading partners in the most efficient, cost-effective, and professional manner possible.
              </p>
            </div>

            <div className="mt-16">
              <h2 className="text-3xl font-bold text-primary mb-8">Our Commitment</h2>
              
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-8 mb-6 transform transition-all hover:scale-[1.02]"
                variants={variants}
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <AiOutlineSolution size={40} className="text-Secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-primary mb-3">Customer-Centricity</h3>
                    <p className="text-gray-700">
                      We deliver a one-stop solution for our clients, covering every step of the process—from sourcing and logistics to customs clearance and everything in between. Our goal is to simplify the complexities of international trade for our customers.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white rounded-xl shadow-lg p-8 transform transition-all hover:scale-[1.02]"
                variants={variants}
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <RiCustomerService2Line size={40} className="text-Secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-primary mb-3">Consultancy Services</h3>
                    <p className="text-gray-700">
                      At RIO, we believe in sharing our expertise. We offer free logistics and supply chain consultancy to help clients conduct business with China effectively and minimize costs. Our skills and knowledge are at the service of our clients, ensuring their success.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            variants={variants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block"
          >
            <div className="sticky top-8 space-y-8">
              <motion.div 
                className="rounded-xl overflow-hidden shadow-xl"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={RioImage} 
                  className="w-full h-[500px] object-cover"
                  alt="RIO" 
                />
              </motion.div>
              <motion.div 
                className="rounded-xl overflow-hidden shadow-xl"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={supplyLogistic} 
                  className="w-full h-[400px] object-cover"
                  alt="Supply and Logistics" 
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default History;


// cobra