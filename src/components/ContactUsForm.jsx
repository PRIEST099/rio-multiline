import { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnimatedContactForm() {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
  };

  const handleInputChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

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
      opacity: 1
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const socialVariants = {
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400 }
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      text: 'Sonatube, Kigali, Rwanda',
      label: 'Our Location'
    },
    {
      icon: Phone,
      text: '+250788875721',
      label: 'Call Us'
    },
    {
      icon: Mail,
      text: 'info@rio.com',
      label: 'Email Us'
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <motion.div 
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div
        className="w-full py-12 mt-12 bg-gradient-to-r from-blue-50 to-indigo-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1 
            className="text-4xl font-bold text-primary text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Contact <span className="text-Secondary">Us</span>
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Get in touch with us for any inquiries or collaboration opportunities.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="w-full">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Contact Form */}
          <motion.div 
            className="bg-white p-8 lg:p-16"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-8 max-w-2xl mx-auto"
              variants={containerVariants}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    FULL NAME
                  </label>
                  <motion.input
                    whileHover={{ scale: 1.01 }}
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Your name"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    EMAIL ADDRESS
                  </label>
                  <motion.input
                    whileHover={{ scale: 1.01 }}
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  SUBJECT
                </label>
                <motion.input
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="subject"
                  value={formState.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="How can we help?"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  MESSAGE
                </label>
                <motion.textarea
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.01 }}
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Your message here..."
                />
              </motion.div>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg"
              >
                Send Message
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Map */}
          <motion.div 
            className="h-full w-full min-h-[600px] relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4894551700134!2d30.0598889!3d-1.9431944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca5d5f7590aa5%3A0x4e4c6c9ba1617831!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1635959773456!5m2!1sen!2sus"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>

        {/* Contact Information and Social Media */}
        <motion.div 
          className="w-full bg-white border-t border-gray-100"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex flex-wrap justify-between items-center gap-8">
              {/* Contact Info */}
              <div className="flex flex-wrap gap-8 lg:gap-16">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div 
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100"
                      whileHover={{ scale: 1.1 }}
                    >
                      <info.icon className="h-5 w-5 text-blue-600" />
                    </motion.div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">{info.label}</span>
                      <span className="text-sm text-gray-900">{info.text}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Social Media Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 group"
                    variants={socialVariants}
                    whileHover="hover"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <social.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                    <span className="sr-only">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}