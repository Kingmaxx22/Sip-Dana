import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import SipDanaLogo from '../components/common/SipDanaLogo';
import { BackArrowIcon } from '../components/common/Icons';

// Membungkus halaman Login dan Register
const AuthLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page-background">
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          color: 'white',
        }}
        onClick={() => navigate('/')} 
      >
        <BackArrowIcon />
      </div>

      <Container className="auth-container">
        <SipDanaLogo />
        <Outlet />
      </Container>
    </div>
  );
};

export default AuthLayout;