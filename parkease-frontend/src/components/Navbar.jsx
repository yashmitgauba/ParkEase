import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <i className="fas fa-parking"></i>
        ParkEase
      </Link>
      <div className="nav-right">
        <div className="nav-links">
          <a href="./">Home</a>
          <a href="#malls">Malls</a>
          <a href="#features">Features</a>
          <a href="./Contactus">Contact</a>
        </div>
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          
        </div>
      </div>
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="menu-header">
            <i className="fas fa-parking"></i>
            <span>ParkEase</span>
            <button className="close-menu" onClick={toggleMobileMenu}>
              ×
            </button>
          </div>
          <nav className="mobile-nav">
            <a href="#home">Home</a>
            <a href="#malls">Malls</a>
            <a href="#features">Features</a>
            <div className="mobile-auth">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          </nav>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
