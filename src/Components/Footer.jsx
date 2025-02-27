import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h5 className="text-lg font-semibold mb-2">Contact Us</h5>
            <ul className="list-none">
              <li className="mb-1">123 Main Street, Anytown, USA</li>
              <li className="mb-1">+1 (123) 456-7890</li>
              <li className="mb-1">info@example.com</li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h5 className="text-lg font-semibold mb-2">Quick Links</h5>
            <ul className="list-none">
              <li className="mb-1"><Link to="/" className="text-white hover:text-blue-400">Home</Link></li>
              <li className="mb-1"><Link to="/about" className="text-white hover:text-blue-400">About Us</Link></li>
              <li className="mb-1"><Link to="/services" className="text-white hover:text-blue-400">Services</Link></li>
              <li className="mb-1"><Link to="/contact" className="text-white hover:text-blue-400">Contact</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h5 className="text-lg font-semibold mb-2">Follow Us</h5>
            <ul className="list-none">
              <li className="mb-1"><Link to="#" className="text-white hover:text-blue-400">Facebook</Link></li>
              <li className="mb-1"><Link to="#" className="text-white hover:text-blue-400">Twitter</Link></li>
              <li className="mb-1"><Link to="#" className="text-white hover:text-blue-400">Instagram</Link></li>
              <li className="mb-1"><Link to="#" className="text-white hover:text-blue-400">LinkedIn</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-700 text-center py-2">
        <p className="mb-0">&copy; 2024 Your Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
