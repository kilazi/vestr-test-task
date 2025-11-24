import React from 'react';
import './Menu.css';

const Menu: React.FC = () => {
  const handleDisabledClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <nav className="menu-nav">
      <a className="menu-link menu-link--disabled" href="/home" onClick={handleDisabledClick}>Home</a>
      <a className="menu-link menu-link--disabled" href="/portfolio/kilazi" onClick={handleDisabledClick}>Portfolios</a>
      <a className="menu-link menu-link--active" href="/quiz">Quiz</a>
      <a className="menu-link menu-link--disabled" href="/leaderboards" onClick={handleDisabledClick}>Leaderboards</a>
      <a className="menu-link menu-link--disabled" href="/news" onClick={handleDisabledClick}>News</a>
      <a className="menu-link menu-link--disabled" href="/feed" onClick={handleDisabledClick}>Research</a>
    </nav>
  );
};

export default Menu;

