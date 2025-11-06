import React from 'react';


const LoadingSpinner = ({ size = 'medium', text = 'Загрузка...' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;