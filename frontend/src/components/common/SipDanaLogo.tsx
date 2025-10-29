import React from 'react';
import logoPNG from '../../assets/logo.png'; 

interface LogoProps {
  className?: string;
}

const SipDanaLogo: React.FC<LogoProps> = ({ className = '' }) => (
  <div className={`sipdana-logo ${className}`} style={{ textDecoration: 'none' }}>
    <img 
      src={logoPNG} 
      alt="SipDana Logo" 
      style={{ width: '200px', height: '70px', objectFit: 'contain', marginRight: '8px' }} 
    />
  </div>
);

export default SipDanaLogo;