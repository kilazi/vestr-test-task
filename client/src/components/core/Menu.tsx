import React from 'react';
import './Menu.css';

const Menu: React.FC = () => {
  return (
    <nav className="menu-nav">
      <a className="menu-link" href="/home">Home</a>
      <a className="menu-link" href="/portfolio/kilazi">Portfolios</a>
      <a className="menu-link menu-link--active" href="/markets">Markets</a>
      <a className="menu-link" href="/leaderboards">Leaderboards</a>
      <a className="menu-link" href="/news">News</a>
      <a className="menu-link" href="/feed">Research</a>
    </nav>
  );
};

export default Menu;

