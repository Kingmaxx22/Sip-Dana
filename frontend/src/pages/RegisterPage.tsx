import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { AlertCircle } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
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
      const response = await authService.register({ username, email, password });
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
      <h2 className="fw-bold h1 mb-4 text-center">Register</h2> 

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

        <Form.Group className="mb-3" controlId="registerName">
          <Form.Label>Nama</Form.Label>
          <Form.Control
            type="text"
            placeholder="Masukkan Nama"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
            autoComplete="username" 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="registerEmail">
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

        <Form.Group className="mb-4" controlId="registerPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Minimal 6 karakter" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            minLength={6} 
            autoComplete="new-password" 
          />
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
            ) : 'Register'}
          </Button>
        </div>
      </Form>

      <Link to="/login" className="auth-link mt-4">
        Sudah punya akun? Masuk
      </Link>
    </>
  );
};

export default RegisterPage;