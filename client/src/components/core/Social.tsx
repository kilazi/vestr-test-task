import React from 'react';
import './Social.css';
import her2Svg from '../../assets/her2.svg';
import vesSvg from '../../assets/ves.svg';
import set2Svg from '../../assets/set2.svg';

const Social: React.FC = () => {
  return (
    <div className="social">
      <div className="social-profile">
        <div className="social-profile-button">Profile</div>
      </div>
      <div className="social-icons">
        <button className="social-icon-button" type="button">
          <img src={her2Svg} className="social-icon-image" alt="" />
        </button>
        <button className="social-icon-button" type="button">
          <img src={vesSvg} className="social-icon-image" alt="" />
        </button>
        <button className="social-icon-button" type="button">
          <img src={set2Svg} className="social-icon-image" alt="" />
        </button>
      </div>
    </div>
  );
};

export default Social;

