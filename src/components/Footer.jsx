import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CiFacebook } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  // WhatsApp number without any spaces or special characters
  const whatsappNumber = "250788875721";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="relative bg-black text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-8">
        {/* Left Footer Content */}
        <div className="text-center">
          <h1 className="font-bold text-3xl mb-4">
            Chat with <span className="text-secondary">us</span>
          </h1>
          <div className="mx-auto w-44 h-44 bg-white p-2 rounded-lg">
            <QRCodeSVG 
              value={whatsappUrl}
              size={160}
              level="H"
              includeMargin={true}
              className="mx-auto"
            />
          </div>
          <p className="mt-4">Connect with us through our social media</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-center w-10 h-10 rounded-full hover:text-black hover:bg-secondary transition-colors duration-300 text-white">
                <CiFacebook className="text-2xl" />
              </div>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-center w-10 h-10 rounded-full hover:text-black hover:bg-secondary transition-colors duration-300 text-white">
                <CiLinkedin className="text-2xl" />
              </div>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-center w-10 h-10 rounded-full hover:text-black hover:bg-secondary transition-colors duration-300 text-white">
                <FaInstagram className="text-2xl" />
              </div>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-center w-10 h-10 rounded-full hover:text-black hover:bg-secondary transition-colors duration-300 text-white">
                <FaSquareXTwitter className="text-2xl" />
              </div>
            </a>
          </div>
        </div>

        {/* Middle Footer Section */}
        <div className="text-center">
          <h1 className="font-bold text-3xl mb-4">Quick Links</h1>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-secondary transition-colors duration-300">Home</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors duration-300">About</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors duration-300">Services</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors duration-300">Contact</a></li>
          </ul>
        </div>

        {/* Right Footer Section */}
        <div className="text-center">
          <h1 className="font-bold text-3xl mb-4">Contact Info</h1>
          <ul className="space-y-3">
            <li>
              <span className="font-bold">Location:</span> NARD House,23 JV+VFG <span className="text-secondary">Sonatube Road</span>
            </li>
            <li>
              <a href="mailto:rio.logistics@gmail.com" className="hover:text-secondary transition-colors duration-300">
                <span className="font-bold">Email:</span> <span className="font-normal">rio.logistics@gmail.com</span>
              </a>
            </li>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors duration-300">
                <span className="font-bold">Phone:</span> <span className="font-normal">+250 788 875 721 / +86 13357145436</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider line */}
      <div className="min-h-0.5 bg-secondary mx-8 mt-8"></div>
      
      {/* Footer Bottom */}
      <div className="text-center mt-8">
        <p className="text-[16px] font-semibold">
          © {new Date().getFullYear()} RIO. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;