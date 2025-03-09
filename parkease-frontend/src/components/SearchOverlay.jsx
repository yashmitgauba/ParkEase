import React, { useState } from 'react';
import '../styles/SearchOverlay.css'; // Make sure to create the corresponding CSS file for styling

const SearchOverlay = ({ isOpen, closeOverlay }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Handle search logic (for example, filtering parking spots based on the search term)
    console.log('Searching for: ', searchTerm);
    closeOverlay(); // Close the overlay after searching
  };

  return (
    <div className={`overlay ${isOpen ? 'open' : ''}`}>
      <div className="overlay-content">
        <button className="close-btn" onClick={closeOverlay}>
          &times;
        </button>
        <h2>Search Parking Spots</h2>
        <input
          type="text"
          placeholder="Search by location, parking type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchOverlay;
