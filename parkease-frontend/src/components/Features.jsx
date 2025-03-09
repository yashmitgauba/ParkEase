import React from 'react';

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="section-header" data-aos="fade-up">
        <h2>Why Choose ParkEase?</h2>
        <p>Experience the future of parking management</p>
      </div>
      <div className="features-grid">
        <div className="feature-card" data-aos="fade-up">
          <div className="feature-icon">
            <i className="fas fa-clock"></i>
          </div>
          <h3>Real-time Updates</h3>
          <p>Get instant notifications about parking availability and updates.</p>
          <a href="#" className="learn-more">
            Learn More <i className="fas fa-arrow-right"></i>
          </a>
        </div>
        <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
          <div className="feature-icon">
            <i className="fas fa-mobile-alt"></i>
          </div>
          <h3>Easy Booking</h3>
          <p>Book your parking spot in advance with just a few taps.</p>
          <a href="#" className="learn-more">
            Learn More <i className="fas fa-arrow-right"></i>
          </a>
        </div>
        <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
          <div className="feature-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3>Secure Payments</h3>
          <p>Multiple secure payment options for hassle-free transactions.</p>
          <a href="#" className="learn-more">
            Learn More <i className="fas fa-arrow-right"></i>
          </a>
        </div>
        <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
          <div className="feature-icon">
            <i className="fas fa-headset"></i>
          </div>
          <h3>24/7 Support</h3>
          <p>Round-the-clock customer support for all your parking needs.</p>
          <a href="#" className="learn-more">
            Learn More <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
