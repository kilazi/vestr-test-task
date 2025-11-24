import React from 'react';
import './Status.css';

interface StatusProps {
  status: string;
}

const Status: React.FC<StatusProps> = ({ status }) => {
  return (
    <div className="status-badge">
      {status}
    </div>
  );
};

export default Status;

