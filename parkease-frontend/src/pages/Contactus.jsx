import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaParking, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import "../styles/Contactus.css";

const ContactPage = () => {
  const [success, setSuccess] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          <FaParking />
          ParkEase
        </Link>
        <div className="nav-right">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/#malls" onClick={handleHomeClick}>Malls</Link>
            <Link to="/#features" onClick={handleHomeClick}>Features</Link>
            <Link to="/contactus">Contact</Link>
          </div>
          <div className="auth-buttons">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </div>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu active">
          <div className="menu-header">
            <FaParking />
            <span>ParkEase</span>
            <button className="close-menu" onClick={() => setMobileMenuOpen(false)}>×</button>
          </div>
          <nav className="mobile-nav">
            <Link to="/">Home</Link>
            <Link to="/#malls" onClick={handleHomeClick}>Malls</Link>
            <Link to="/#features" onClick={handleHomeClick}>Features</Link>
            <Link to="/contactus">Contact</Link>
            <div className="mobile-auth">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </div>
          </nav>
        </div>
      )}

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-info" data-aos="fade-right">
          <h1>Get in Touch</h1>
          <p>Have questions about ParkEase? We're here to help! Reach out to us through any of these channels.</p>

          <div className="contact-cards">
            <div className="contact-card">
              <FaMapMarkerAlt />
              <div className="contact-card-content">
                <h3>Visit Us</h3>
                <p>123 Business Avenue, Tech District<br />New York, NY 10001</p>
              </div>
            </div>

            <div className="contact-card">
              <FaPhone />
              <div className="contact-card-content">
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567<br />Mon-Fri, 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="contact-card">
              <FaEnvelope />
              <div className="contact-card-content">
                <h3>Email Us</h3>
                <p>support@parkease.com<br />info@parkease.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form" data-aos="fade-left">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>

            <button type="submit" className="submit-btn">Send Message</button>
            {success && <div className="success-message">Thank you for your message! We'll get back to you soon.</div>}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ParkEase</h3>
            <p>Making parking easier, one spot at a time.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/#malls" onClick={handleHomeClick}>Malls</Link>
            <Link to="/#features" onClick={handleHomeClick}>Features</Link>
            <Link to="/contactus">Contact</Link>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <Link to="/faq">FAQ</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/help">Help Center</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ParkEase. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default ContactPage;
