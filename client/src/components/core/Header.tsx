import React from 'react';
import TopBar from './TopBar';
import Search from './Search';
import Menu from './Menu';
import Social from './Social';
import './Header.css';

const Header: React.FC = () => {
  return (
    <>
      <TopBar />
      <div className="header">
        <div className="header-logo">
          <div>
            <b className="header-logo-text">VESTR</b>
            <i className="header-logo-subtitle">Financial education and <br />simulated investing</i>
          </div>
        </div>

        <div className="header-center">
          <Search />
          <Menu />
        </div>

        <Social />
      </div>
    </>
  );
};

export default Header;

