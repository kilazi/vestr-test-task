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
      <div className="header-wrapper">
        <div className="header">
          <div className="header-logo">
            <div>
              <b className="header-logo-text">TESTTASK</b>
              <i className="header-logo-subtitle">github.com/kilazi/vestr-test-task <br />Done in an hour</i>
            </div>
          </div>

          <div className="header-center">
            <Search />
            <Menu />
          </div>

          <Social />
        </div>
      </div>
    </>
  );
};

export default Header;

