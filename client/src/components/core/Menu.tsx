import React from 'react';
import './Menu.css';

const Menu: React.FC = () => {
  return (
    <nav className="menu">
      <div className="menu-content">
        <a href="#" className="menu-item">Home</a>
        <a href="#" className="menu-item">Portfolios</a>
        <a href="#" className="menu-item">Markets</a>
        <a href="#" className="menu-item">Leaderboards</a>
        <a href="#" className="menu-item">News</a>
        <a href="#" className="menu-item">Research</a>
        <div className="menu-right">
          <button className="profile-button">Profile</button>
          <button className="icon-button">❤️</button>
          <button className="icon-button">▼</button>
          <button className="icon-button">⚙️</button>
        </div>
      </div>
    </nav>
  );
};

export default Menu;

