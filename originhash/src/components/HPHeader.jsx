import React from 'react';
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link } from 'react-router-dom';

const HPHeader = () => {
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Emergency", path: "/emergency" },
    { label: "Find Hospitals", path: "/find-hospitals" },
    { label: "About us", path: "/about" },
    { label: "Contact us", path: "/contact" },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="MRGENSEE" className="h-14 w-auto" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Join as Hospital Button */}
          <Button 
            asChild
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Link to="/join-hospital">
              Join as Hospital
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default HPHeader;