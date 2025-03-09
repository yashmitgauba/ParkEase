import React, { useState, useRef, useEffect } from 'react';
import AOS from 'aos';
import Navbar from '../components/Navbar';
import Hero from '../components/Herocomponent';
import Malls from '../components/Mallscomp';
import Features from '../components/Features';
import Footer from '../components/Footer';
import '../styles/Home.css';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Home = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  const openSearch = () => {
    setSearchActive(true);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const closeSearch = () => {
    setSearchActive(false);
    document.body.style.overflow = 'auto';
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero openSearch={openSearch} />
        <Malls />
        <Features />
      </main>
      <Footer />

      {/* Search Overlay */}
      <div className={`search-overlay ${searchActive ? "active" : ""}`}>
        <div className="search-container">
          <div className="search-header">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search for malls, areas, or landmarks..."
              value={searchQuery}
              onChange={handleSearchChange}
              ref={searchInputRef}
            />
            <button className="close-search" onClick={closeSearch}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="search-results">
            <div className="trending-searches">
              <h3>Trending Searches</h3>
              <div className="trending-items">
                <a href="#" className="trending-item">
                  <i className="fas fa-fire"></i>
                  <span>City Center Mall</span>
                </a>
                <a href="#" className="trending-item">
                  <i className="fas fa-fire"></i>
                  <span>Metro Plaza</span>
                </a>
                <a href="#" className="trending-item">
                  <i className="fas fa-fire"></i>
                  <span>Downtown Mall</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;