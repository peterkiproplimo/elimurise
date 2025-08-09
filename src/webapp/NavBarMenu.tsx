import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../base-components/Button";
import { 
  Menu, 
  X, 
  User, 
  LogIn, 
  BookOpen, 
  Users, 
  GraduationCap,
  BarChart3,
  Shield,
  Headphones,
  ChevronDown
} from "lucide-react";

const NavbarMenu = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const features = [
    { name: "Assessment Tools", href: "#assessment", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Student Management", href: "#students", icon: <Users className="w-4 h-4" /> },
    { name: "Parent Portal", href: "#parents", icon: <GraduationCap className="w-4 h-4" /> },
    { name: "Analytics", href: "#analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { name: "Security", href: "#security", icon: <Shield className="w-4 h-4" /> },
    { name: "Support", href: "#support", icon: <Headphones className="w-4 h-4" /> }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-primary">Elimurise</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Features
            </a>
            
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Solutions
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              {showDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {features.map((feature) => (
                    <a
                      key={feature.name}
                      href={feature.href}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      <span className="mr-3 text-primary">{feature.icon}</span>
                      {feature.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="#about" className="text-gray-700 hover:text-primary transition-colors font-medium">
              About
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Pricing
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Contact
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth/login">
              <Button variant="outline-primary" size="sm" className="flex items-center">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-primary p-2"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-primary font-medium">
                Features
              </a>
              
              {/* Mobile Solutions Dropdown */}
              <div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-primary font-medium"
                >
                  Solutions
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDropdown && (
                  <div className="pl-4 space-y-1">
                    {features.map((feature) => (
                      <a
                        key={feature.name}
                        href={feature.href}
                        className="flex items-center px-3 py-2 text-gray-600 hover:text-primary transition-colors"
                      >
                        <span className="mr-3 text-primary">{feature.icon}</span>
                        {feature.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-primary font-medium">
                About
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-primary font-medium">
                Pricing
              </a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-primary font-medium">
                Contact
              </a>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-2 border-t border-gray-200 mt-4">
                <Link to="/auth/login">
                  <Button variant="outline-primary" className="w-full flex items-center justify-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="w-full flex items-center justify-center">
                    <User className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarMenu;
