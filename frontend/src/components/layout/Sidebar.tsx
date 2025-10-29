import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SipDanaLogo from '../common/SipDanaLogo';
import { HouseIcon, FolderIcon, UserIcon, CloseIcon } from '../dashboard/IconsDashboard';
import { BarChart3, BookOpen, Target } from 'lucide-react';
import './Sidebar.css'; 
import { useAuth } from '../../context/AuthContext';

const AvatarPlaceholderSidebar: React.FC<{ username: string | undefined }> = ({ username }) => {
  const initial = username ? username.charAt(0).toUpperCase() : '?';
  return (
    <div className="sidebar-avatar-placeholder">
      {initial}
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/dashboard', text: 'Home', icon: <HouseIcon /> },
  { path: '/analytics', text: 'Analytics', icon: <BarChart3 /> },
  { path: '/metode-mengelola', text: 'Metode Mengelola', icon: <BookOpen /> },
  { path: '/target-menabung', text: 'Target Menabung', icon: <Target /> },
  { path: '/profile', text: 'Profile', icon: <UserIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth(); 

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      ></div>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <SipDanaLogo />
          <div onClick={onClose} className="close-btn"> 
            <CloseIcon size="24px" /> 
          </div>
        </div>

        <hr className="sidebar-divider my-0" />
        <div className="sidebar-user-profile">
          <AvatarPlaceholderSidebar username={user?.username} />
          <div className="user-info">
            <p className="user-name mb-0">{user?.username || 'Pengguna'}</p>
            <p className="user-email mb-0">{user?.email || 'email@contoh.com'}</p>
          </div>
        </div>

        <hr className="sidebar-divider my-0" />

        <Nav className="flex-column p-3 sidebar-nav flex-grow-1">
          {navItems.map((item) => (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              onClick={onClose}
              className={`nav-item-custom ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.text}</span>
              {location.pathname === item.path && (
                <span className="active-indicator"></span>
              )}
            </Nav.Link>
          ))}
        </Nav>

         <div className="sidebar-footer text-center text-muted small py-2">
            SipDana © 2025.
         </div>
      </div>
    </>
  );
};

export default Sidebar;