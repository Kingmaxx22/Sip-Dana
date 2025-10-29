import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { MenuIcon } from '../dashboard/IconsDashboard';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string; 
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => { 
  return (
    <Navbar style={{ backgroundColor: '#e0f7fa' }} className="shadow-sm">
      <Container fluid>
        <Button
          variant="link"
          onClick={onToggleSidebar}
          className="text-dark p-0 me-3"
        >
          <MenuIcon />
        </Button>

        <Navbar.Brand href="#home" className="fw-bold m-0">
          {title} 
        </Navbar.Brand>

        <div className="ms-auto">
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;