import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useFormModal } from "../context/FormModalContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openForm } = useFormModal() || {};

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-form');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const openFlightForm = () => {
    if (openForm) openForm("flight");
    setIsOpen(false);
  };

  const openLogisticsForm = () => {
    if (openForm) openForm("logistics");
    setIsOpen(false);
  };

  // Dynamically set the active tab based on the current URL
  const getNavLinks = () => {
    const currentPath = window.location.pathname; // e.g., "/blogs", "/"
    return [
      { href: '/', text: 'Home', current: currentPath === '/' },
      { href: '/about', text: 'About us', current: currentPath === '/about' },
      { action: scrollToServices, text: 'Services', current: false }, // No href, so no path-based activation
      { action: openFlightForm, text: 'Flight Ticketing', current: false },
      { action: openLogisticsForm, text: 'Logistics Quotation', current: false },
      { href: '/blogs', text: 'Waruziko', current: currentPath === '/blogs' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/logo1.png"
              alt="Company Logo" 
              className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
            <h1 className="text-xl font-bold text-secondary">
              RIO MULTILINE LTD
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ href, text, current, action }) => (
              <React.Fragment key={text}>
                {action ? (
                  <button
                    onClick={action}
                    className={`text-sm font-medium transition-all duration-200 hover:text-blue-600 
                      relative after:content-[''] after:absolute after:w-0 after:h-0.5 
                      after:bg-blue-600 after:left-0 after:-bottom-1 after:transition-all 
                      after:duration-300 hover:after:w-full ${
                      current ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {text}
                  </button>
                ) : (
                  <a
                    href={href}
                    className={`text-sm font-medium transition-all duration-200 hover:text-blue-600 
                      relative after:content-[''] after:absolute after:w-0 after:h-0.5 
                      after:bg-blue-600 after:left-0 after:-bottom-1 after:transition-all 
                      after:duration-300 hover:after:w-full ${
                      current ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {text}
                  </a>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 
              hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 pointer-events-none'
          }`}
        >
          <div className="py-3 space-y-3 border-t border-gray-200">
            {navLinks.map(({ href, text, current, action }) => (
              <React.Fragment key={text}>
                {action ? (
                  <button
                    onClick={action}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-md 
                      transition-colors duration-200 hover:bg-gray-100 ${
                      current ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {text}
                  </button>
                ) : (
                  <a
                    href={href}
                    className={`block px-4 py-2 text-sm font-medium rounded-md 
                      transition-colors duration-200 hover:bg-gray-100 ${
                      current ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {text}
                  </a>
                )}
              </React.Fragment>
            ))}
            <div className="px-4 py-3">
              <button 
                onClick={scrollToContact}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-md text-sm 
                  font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-md"
              >
                Contact us
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;