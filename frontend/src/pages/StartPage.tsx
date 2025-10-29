import React, { useEffect } from 'react'; 
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ilustrasi1 from '../assets/ilustrasi1.png';
import { useAuth } from '../context/AuthContext';

const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated()) {
    return null;
  }

  return (
    <div className="start-page-background">
      <Container className="start-page-container">
        <Row className="align-items-center justify-content-center g-5">
          <Col md={6} className="text-center text-md-start">
            <h1 className="display-3 fw-bold mb-3" style={{ color: 'var(--sipdana-primary)' }}>
              Welcome
              <br />
              to SipDana
            </h1>
            <Button
              variant="" 
              size="lg"
              className="btn-sipdana-primary mt-3" 
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
          </Col>

          <Col md={6} className="text-center">
            <img
              src={ilustrasi1}
              alt="Financial illustration"
              className="img-fluid rounded-3"
              style={{ maxWidth: '400px', width: '100%' }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StartPage;