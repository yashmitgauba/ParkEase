import React, { useState } from "react";

const Malls = () => {
  const mallsData = [
    {
      id: 1,
      name: "City Center Mall",
      location: "123 Main Street, Downtown",
      image:
        "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&q=80&w=800",
      spots: 45,
      category: "popular",
      price: "$2/hour",
      rating: 4.5,
      distance: "0.5 km",
    },
    {
      id: 2,
      name: "Metro Plaza",
      location: "456 Park Avenue, Midtown",
      image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800",
      spots: 32,
      category: "nearby",
      price: "$3/hour",
      rating: 4.2,
      distance: "1.2 km",
    },
    {
      id: 3,
      name: "Riverside Mall",
      location: "789 River Road, Westside",
      image:
        "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=800",
      spots: 28,
      category: "available",
      price: "$2.5/hour",
      rating: 4.7,
      distance: "2.1 km",
    },
  ];

  const [filter, setFilter] = useState("all");

  const filteredMalls = mallsData.filter(
    (mall) =>
      filter === "all" ||
      mall.category === filter
  );

  return (
    <section className="malls-section" id="malls">
      <div className="section-header" data-aos="fade-up">
        <h2>Popular Malls Near You</h2>
        <p>Discover available parking spots at top shopping destinations</p>
      </div>
      <div className="malls-filter">
        <button onClick={() => setFilter("all")} className="filter-btn active">
          All Malls
        </button>
        <button onClick={() => setFilter("nearby")} className="filter-btn">
          Nearby
        </button>
        <button onClick={() => setFilter("popular")} className="filter-btn">
          Most Popular
        </button>
        <button onClick={() => setFilter("available")} className="filter-btn">
          Available Now
        </button>
      </div>
      <div className="malls-grid">
        {filteredMalls.map((mall) => (
          <div key={mall.id} className="mall-card">
            <img src={mall.image} alt={mall.name} className="mall-image" />
            <div className="mall-info">
              <h3>{mall.name}</h3>
              <div className="mall-location">
                <i className="fas fa-map-marker-alt"></i>
                <span>{mall.location}</span>
              </div>
              <div className="mall-stats">
                <div className="mall-stat">
                  <span className="mall-stat-number">{mall.spots}</span>
                  <span className="mall-stat-label">Available</span>
                </div>
                <div className="mall-stat">
                  <span className="mall-stat-number">{mall.price}</span>
                  <span className="mall-stat-label">Rate</span>
                </div>
                <div className="mall-stat">
                  <span className="mall-stat-number">
                    {mall.rating} <i className="fas fa-star"></i>
                  </span>
                  <span className="mall-stat-label">Rating</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="load-more">Load More Malls</button>
    </section>
  );
};

export default Malls;
