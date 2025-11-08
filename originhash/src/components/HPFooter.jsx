import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const HPFooter = () => {
  const footerLinks = {
    support: [
      { label: "Getting Started", path: "/getting-started" },
      { label: "FAQS", path: "/faqs" },
      { label: "Help Articles", path: "/help" },
      { label: "Contact Help Desk", path: "/contact-help" },
    ],
    legal: [
      { label: "Terms & Conditions", path: "/terms" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Cookie Notice", path: "/cookie-notice" },
      { label: "Report an issue", path: "/report-issue" },
      { label: "Trust Center", path: "/trust-center" },
    ],
    services: [
      { label: "Booking appointments", path: "/book" },
      { label: "Medical Notes", path: "/medical-notes" },
      { label: "Cookie Preferences", path: "/cookie-preferences" },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, url: "https://facebook.com" },
    { icon: <Instagram className="h-5 w-5" />, url: "https://instagram.com" },
    { icon: <Linkedin className="h-5 w-5" />, url: "https://linkedin.com" },
    { icon: <Youtube className="h-5 w-5" />, url: "https://youtube.com" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <footer className="bg-blue-50 pt-16 pb-8">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.svg" alt="MRGENSEE" className="h-40 w-auto" />
            </Link>
            <p className="text-gray-600 text-sm">
              Because Every Emergency
              <br />
              Deserves the Fastest Response
            </p>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-gray-600 hover:text-blue-600 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-gray-600 hover:text-blue-600 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-gray-600 hover:text-blue-600 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              MRGENSEE 2025 © All Rights Reserved
            </p>
            <div className="flex space-x-6">
              <h4 className="text-gray-600 text-sm mr-4">Follow us</h4>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default HPFooter;