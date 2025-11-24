import React from 'react';
import './TopBar.css';

const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <span className="market-index">DJI $30,120.34 <span className="positive">▲ 2.32%</span></span>
        <span className="market-index">SPX $5,301.65 <span className="positive">▲ 5.31%</span></span>
        <span className="market-index">IXIC $16,723.65 <span className="positive">▲ 1.00%</span></span>
        <span className="market-index">RUT $2,108.05 <span className="positive">▲ 1.00%</span></span>
        <span className="market-index">BTC $66,163.65 <span className="positive">▲ 11.29%</span></span>
        <span className="market-index">VIX 12.65 <span className="negative">▼ 4.00%</span></span>
        <span className="market-index">GOOG $66,163.65 <span className="positive">▲ 11.29%</span></span>
        <span className="market-index">TSLA $66,163.65 <span className="positive">▲ 11.29%</span></span>
        <span className="market-index">AAPL $66,163.65 <span className="positive">▲ 11.29%</span></span>
      </div>
    </div>
  );
};

export default TopBar;

