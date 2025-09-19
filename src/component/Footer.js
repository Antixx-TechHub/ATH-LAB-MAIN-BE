"use client";
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Optional: For social media icons

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Dynamically get the current year

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
               <img src="/asset/footer-logo.svg" alt="Company Logo" className="h-12 w-auto mb-4" />
            <p className="text-sm text-neutral-200 mb-4">
              Antixx TechHub offers a range of tailor-made enterprise solutions
              to help businesses improve visibility, branding, efficiencies,
              productivity, quality, profitability, and customer relationship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="/about" className="hover:text-gray-300">
                  About
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-gray-300">
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-gray-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm border-t border-gray-700 pt-4">
          <p>
            &copy; 2014-2025 Antixx TechHub Pvt. Ltd. – All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
