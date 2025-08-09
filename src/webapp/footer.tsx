import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FormInput } from "../base-components/Form";
import Button from "../base-components/Button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  BookOpen,
  Users,
  Shield,
  Headphones
} from "lucide-react";

const FooterComponent = () => {   
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic
    console.log("Subscribing:", email);
    setEmail("");
  };

  const quickLinks = [
    { name: "Features", href: "#features" },
    { name: "About Us", href: "#about" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
    { name: "Privacy Policy", href: "/policy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Support", href: "/support" }
  ];

  const features = [
    { name: "Assessment Tools", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Student Management", icon: <Users className="w-4 h-4" /> },
    { name: "Parent Portal", icon: <Users className="w-4 h-4" /> },
    { name: "Security", icon: <Shield className="w-4 h-4" /> },
    { name: "24/7 Support", icon: <Headphones className="w-4 h-4" /> }
  ];

  const contactInfo = [
    { icon: <Mail className="w-4 h-4" />, text: "info@elimurise.com" },
    { icon: <Phone className="w-4 h-4" />, text: "+254 700 000 000" },
    { icon: <MapPin className="w-4 h-4" />, text: "Nairobi, Kenya" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, href: "#" },
    { name: "YouTube", icon: <Youtube className="w-5 h-5" />, href: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Elimurise</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Empowering schools with modern education technology. 
              Transform your institution with comprehensive management tools.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {quickLinks.slice(4, 7).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <FormInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((contact, index) => (
              <div key={index} className="flex items-center">
                <span className="text-primary mr-3">{contact.icon}</span>
                <span className="text-gray-300">{contact.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h4 className="text-lg font-semibold mb-4">Key Features</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex items-center text-gray-300">
                <span className="text-primary mr-2">{feature.icon}</span>
                <span className="text-sm">{feature.name}</span>
              </div>
            ))}
            </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Elimurise. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="/cookies" className="hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
