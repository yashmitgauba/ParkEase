import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/shared.css';
import '../styles/UserDashboard.css';

const Dashboard = () => {
  const [isSidebarActive, setSidebarActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const parkingSpots = [
    {
      id: 1,
      name: "Central Plaza Parking",
      distance: "0.5 km away",
      price: "$2/hr",
      image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800",
      features: ["24/7 Security", "EV Charging", "Accessible"],
    },
    {
      id: 2,
      name: "Airport Terminal Parking",
      distance: "1.2 km away",
      price: "$3/hr",
      image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800",
      features: ["CCTV", "Covered", "24/7"],
    },
    {
      id: 3,
      name: "Hospital Visitor Parking",
      distance: "0.8 km away",
      price: "$1.5/hr",
      image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800",
      features: ["Accessible", "Security", "24/7"],
    },
  ];

  const stats = [
    { number: "150+", label: "Available Spots", icon: "fas fa-car" },
    { number: "25", label: "Locations", icon: "fas fa-map-marker-alt" },
    { number: "10k+", label: "Happy Users", icon: "fas fa-smile" },
    { number: "4.8", label: "User Rating", icon: "fas fa-star" },
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const toggleMobileMenu = () => {
    setSidebarActive(!isSidebarActive);
    document.body.style.overflow = !isSidebarActive ? 'hidden' : '';
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarActive ? 'active' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <i className="fas fa-parking" />
            ParkEase
          </Link>
        </div>
        <nav className="nav-menu">
          <Link to="/dashboard" className="nav-link active">
            <i className="fas fa-home" />
            Dashboard
          </Link>
          <Link to="/bookings" className="nav-link">
            <i className="fas fa-ticket-alt" />
            My Bookings
          </Link>
          <Link to="/user-settings" className="nav-link">
            <i className="fas fa-cog" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="search-container">
            <i className="fas fa-search search-icon" />
            <input type="text" className="search-bar" placeholder="Search for parking spots..." />
          </div>
          <div className="top-nav-actions">
            <button className="notification-btn">
              <i className="fas fa-bell" />
              <span className="notification-badge">4</span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">JD</div>
            </div>
          </div>
        </nav>

        <main className="main-content">
          {/* Category Navigation */}
          <nav className="category-nav">
            {['All', 'Event Venues', 'Airports', 'Hospitals', 'Shopping Malls', 'List Your Parking'].map((category) => (
              <button
                key={category}
                className={`category-btn ${activeCategory === category.toLowerCase() ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.toLowerCase())}
              >
                {category}
              </button>
            ))}
          </nav>

          {/* Stats Overview */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" data-aos="fade-up">
                <div className="stat-icon">
                  <i className={stat.icon} />
                </div>
                <div className="stat-info">
                  <h3>{stat.number}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Nearby Parking Spots */}
          <div className="section-header">
            <h2>Nearby Parking Spots</h2>
            <Link to="/all-spots" className="view-all">View All</Link>
          </div>

          <div className="parking-spots-grid">
            {parkingSpots.map((spot) => (
              <div key={spot.id} className="parking-spot-card" data-aos="fade-up">
                <img src={spot.image} alt={spot.name} className="spot-image" />
                <div className="spot-info">
                  <h3>{spot.name}</h3>
                  <p className="distance">
                    <i className="fas fa-map-marker-alt"></i> {spot.distance}
                  </p>
                  <div className="spot-features">
                    {spot.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  <div className="spot-actions">
                    <span className="price">{spot.price}</span>
                    <button className="book-now">Book Now</button>
                    <button className="favorite-btn">
                      <i className="far fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        <i className="fas fa-bars" />
      </button>

      {/* Overlay */}
      <div 
        className={`overlay ${isSidebarActive ? 'active' : ''}`} 
        onClick={toggleMobileMenu}
      />
    </div>
  );
};

export default Dashboard;
