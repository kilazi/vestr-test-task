import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">VESTR</div>
          <div className="tagline">Financial Literacy and Stock Market Investing</div>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input type="text" placeholder="Search Vestr" className="search-input" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

