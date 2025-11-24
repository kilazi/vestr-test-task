import React from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import './TopBar.css';

const TopBar: React.FC = () => {
  const { marketData, connected } = useWebSocket();

  const formatPrice = (price: string): string => {
    const num = parseFloat(price);
    if (num >= 1000) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return num.toFixed(2);
  };

  const formatChangePercent = (percent: number): string => {
    return Math.abs(percent).toFixed(2);
  };

  // Duplicate the data for seamless scrolling
  const duplicatedData = connected && marketData.length > 0 
    ? [...marketData, ...marketData] 
    : [];

  return (
    <div className="top-bar">
      <div className="top-bar-content">
        {connected && marketData.length > 0 ? (
          duplicatedData.map((data, index) => (
            <span key={`${data.symbol}-${index}`} className="market-index">
              {data.symbol} ${formatPrice(data.price)}{' '}
              {data.changePercent >= 0 ? (
                <span className="positive">▲ {formatChangePercent(data.changePercent)}%</span>
              ) : (
                <span className="negative">▼ {formatChangePercent(data.changePercent)}%</span>
              )}
            </span>
          ))
        ) : (
          <span className="market-index">Connecting to market data...</span>
        )}
      </div>
    </div>
  );
};

export default TopBar;

