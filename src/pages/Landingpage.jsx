import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar";
import Hero from '../components/Hero';
import History from '../components/History';
import Services from '../components/Services';
import MissionVision from '../components/MissionVision';
import Benefits from '../components/Benefits';
import OurPort from '../components/OurPort';
import ContactUsForm from '../components/ContactUsForm';
import Footer from '../components/Footer';
import Pricing from "../components/Pricing";
import { useFormModal } from "../context/FormModalContext";
const AnimatedSection = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          ease: "easeOut"
        }
      }}
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const LandingPage = ({ openFormType }) => {
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const { openForm } = useFormModal() || {};

  useEffect(() => {
    if (openFormType && openForm) {
      openForm(openFormType === "logistics" ? "logistics" : "flight");
    }
  }, [openFormType, openForm]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 23;
              if (days > 0) {
                days -= 1;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  // Stagger animation variants for sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Navbar />
      
      {/* Hero doesn't need AnimatedSection wrapper as it's typically above the fold */}
      <Hero />

      {/* Wrap each section in AnimatedSection for scroll-triggered animations */}
      <AnimatedSection>
        <History />
      </AnimatedSection>

      <AnimatedSection>
        <Services />
      </AnimatedSection>

      <AnimatedSection>
        <Pricing />
      </AnimatedSection>

      <AnimatedSection>
        <MissionVision />
      </AnimatedSection>

      <AnimatedSection>
        <Benefits />
      </AnimatedSection>

      <AnimatedSection>
        <OurPort />
      </AnimatedSection>

      <AnimatedSection>
        <ContactUsForm />
      </AnimatedSection>

      <AnimatedSection>
        <Footer />
      </AnimatedSection>
    </motion.div>
  );
};

export default LandingPage;