import React from 'react';
import { Button } from 'react-bootstrap';
// Pastikan path ikon benar
import { PenIcon } from './IconsDashboard'; 
import { useNavigate } from 'react-router-dom';

const AddTransactionButton: React.FC = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/tambah-transaksi'); 
  };

  return (
    <Button
      variant="" 
      className="btn-sipdana-primary rounded-circle shadow-lg" 
      style={{
        position: 'fixed',
        bottom: '30px', 
        right: '30px', 
        width: '50px', 
        height: '50px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 0, 
      }}
      onClick={handleAddClick}
    >
      <PenIcon size="30px" /> 
    </Button>
  );
};

export default AddTransactionButton;