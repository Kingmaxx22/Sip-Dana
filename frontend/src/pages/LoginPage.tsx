import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService'; 
import { AlertCircle } from 'lucide-react'; 

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="fw-bold h1 mb-4 text-center">Login</h2> 

      <Form className="auth-form" onSubmit={handleSubmit}>
        
        {error && (
          <Alert 
            variant="" 
            className="d-flex align-items-center mb-3" 
            style={{ 
              backgroundColor: 'var(--sipdana-accent-red-bg-light)', 
              color: 'var(--sipdana-accent-red-text)',
              borderColor: 'var(--sipdana-accent-red-base)', 
              borderRadius: '8px', 
            }}
            dismissible
            onClose={() => setError(null)} 
          >
            <AlertCircle size={18} className="me-2 flex-shrink-0"/> 
            {error}
          </Alert>
        )}

        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            autoComplete="email" 
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="current-password" 
          />
          <div className="text-end mt-2">
            <Link to="#" className="auth-link" style={{ fontSize: '0.9rem' }}>
              Lupa Password?
            </Link>
          </div>
        </Form.Group>

        <div className="d-grid mt-4">
          <Button
            variant="" 
            type="submit"
            className="btn-sipdana-primary" 
            disabled={loading}
            size="lg" 
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2"/> Loading...
              </>
             ) : 'Login'}
          </Button>
        </div>
      </Form>

      <Link to="/register" className="auth-link mt-5">
        Belum punya akun? Daftar
      </Link>
    </>
  );
};

export default LoginPage;