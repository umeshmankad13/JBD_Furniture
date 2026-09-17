import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer p-10 bg-gradient-to-br from-[#181e29] to-[#232a38] text-white rounded-t-3xl mt-16 border-t border-blue-200/10 shadow-2xl">
      <div className="footer grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start">
          <span className="text-2xl font-extrabold text-yellow-300 mb-2 tracking-wide">JBDFurniture</span>
          <span className="text-blue-200 text-sm mb-4 text-center md:text-left">Premium Custom Furniture & Interiors</span>
          <div className="flex gap-2 mt-2">
            <a href="https://www.instagram.com/jbd_furniture_865?igsh=MTFodTBsNTNlOGdwcQ==" aria-label="Instagram" className="btn btn-ghost btn-circle text-pink-400 hover:bg-pink-400/20"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="Facebook" className="btn btn-ghost btn-circle text-blue-400 hover:bg-blue-400/20"><Facebook className="w-5 h-5" /></a>
            <a href="#" aria-label="Twitter" className="btn btn-ghost btn-circle text-sky-400 hover:bg-sky-400/20"><Twitter className="w-5 h-5" /></a>
            <a href="#" aria-label="WhatsApp" className="btn btn-ghost btn-circle text-green-400 hover:bg-green-400/20"><MessageCircle className="w-5 h-5" /></a>
          </div>
        </div>
        {/* Quick Links */}
        <div className="flex flex-col items-center">
          <span className="footer-title text-yellow-300">Quick Links</span>
          <Link to="/" className="link link-hover text-blue-100 hover:text-yellow-300">Home</Link>
          <Link to="/about" className="link link-hover text-blue-100 hover:text-yellow-300">About Us</Link>
          <Link to="/offerings" className="link link-hover text-blue-100 hover:text-yellow-300">Our Offerings</Link>
          <Link to="/projects" className="link link-hover text-blue-100 hover:text-yellow-300">Projects</Link>
          <Link to="/contact" className="link link-hover text-blue-100 hover:text-yellow-300">Contact Us</Link>
        </div>
        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-end">
          <span className="footer-title text-yellow-300">Contact</span>
          <div className="flex items-center gap-2 mt-1">
            <Mail className="w-5 h-5 text-yellow-300" />
            <a href="mailto:dilipsuthar6165@gmail.com.com" className="link link-hover text-blue-100 hover:text-yellow-300">dilipsuthar6165@gmail.com</a>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Phone className="w-5 h-5 text-yellow-300" />
            <a href="tel:+916377763522" className="link link-hover text-blue-100 hover:text-yellow-300">+91 6377 763 522</a>
          </div>
        </div>
      </div>
      <div className="divider divider-accent my-0" />
      <div className="text-center text-xs text-blue-200/60 mt-2">
        &copy; {new Date().getFullYear()} JBDFurniture. All rights reserved.
      </div>
    </footer>
  );  
} 