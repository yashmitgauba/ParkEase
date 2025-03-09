import React from "react";

const Hero = ({ openSearch }) => {
  return (
    <section className="hero" id="home">
      <div className="hero-content" data-aos="fade-right">
        <h1>Find Perfect Parking Spots</h1>
        <p>
          Discover and reserve parking spaces at your favorite malls instantly.
          Save time and enjoy hassle-free parking.
        </p>
        <div className="hero-search-container">
          <button className="hero-search-btn" onClick={openSearch}>
            <i className="fas fa-search"></i>
            <span>Search for malls, areas, or landmarks...</span>
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Parking Locations</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50k+</span>
            <span className="stat-label">Happy Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
      </div>
      <div className="hero-image" data-aos="fade-left">
        <img
          src="https://images.unsplash.com/photo-1545179605-1296651e9d43?auto=format&fit=crop&q=80&w=800"
          alt="Parking Illustration"
        />
        <div className="floating-card card-1">
          <i className="fas fa-car"></i>
          <span>Real-time Updates</span>
        </div>
        <div className="floating-card card-2">
          <i className="fas fa-clock"></i>
          <span>Quick Booking</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
