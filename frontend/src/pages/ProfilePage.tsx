import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { User, Mail, Lock, LogOut, Save, UserCircle } from 'lucide-react';

const AvatarPlaceholder: React.FC<{ username: string }> = ({ username }) => {
  const initial = username ? username.charAt(0).toUpperCase() : '?';
  return (
    <div
      className="profile-avatar-placeholder mx-auto"
      style={{
        backgroundColor: 'var(--sipdana-secondary-light)',
        color: 'var(--sipdana-primary)',
      }}
    >
      {initial}
    </div>
  );
};


const ProfilePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsEditingProfile(true); setProfileError(null); setProfileSuccess(null);
    try { const response = await userService.updateProfile({ username, email }); setProfileSuccess(response.data.message || "Profil berhasil diperbarui!"); const updatedUser = response.data.user; const currentToken = localStorage.getItem('sipdana-token'); if (updatedUser && currentToken) { login(updatedUser, currentToken); } } catch (err: any) { const apiError = err.response?.data?.message || 'Gagal menyimpan profil.'; setProfileError(apiError); } finally { setIsEditingProfile(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setPasswordError(null); setPasswordSuccess(null);
    if (newPassword !== confirmPassword) { setPasswordError("Password baru dan konfirmasi tidak cocok."); return; }
    if (newPassword.length < 6) { setPasswordError("Password baru minimal 6 karakter."); return; }
    setIsChangingPassword(true);
    try { const response = await userService.changePassword({ currentPassword, newPassword }); setPasswordSuccess(response.data.message || "Password berhasil diganti!"); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); } catch (err: any) { const apiError = err.response?.data?.message || 'Gagal mengganti password.'; setPasswordError(apiError); } finally { setIsChangingPassword(false); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header onToggleSidebar={() => {}} title="Loading..." /> 
        <main
          className="flex-grow-1 d-flex justify-content-center align-items-center" 
          style={{ backgroundColor: 'var(--sipdana-body-bg)' }} 
        >
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <Header onToggleSidebar={toggleSidebar} title="Profile" />

      <main
        className="flex-grow-1"
        style={{
          backgroundColor: 'var(--sipdana-body-bg)', 
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }}
      >
        <Container fluid="lg">
          <Row className="mb-4">
            <Col>
              <div>
                <h2 className="mb-2 fw-bold d-flex align-items-center" style={{ color: 'var(--sipdana-gray-900)' }}>
                  <UserCircle size={32} className="me-2" style={{ marginBottom: '4px', color: 'var(--sipdana-primary)' }}/>
                  Profil Pengguna
                </h2>
                <p className="mb-0" style={{ color: 'var(--sipdana-gray-600)' }}>
                  Kelola informasi akun Anda
                </p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center g-4">
            <Col md={6}>
              <Card className="shadow-sm border-0 h-100" style={{ borderRadius: '15px' }}>
                 <Card.Header className="bg-white fw-bold d-flex align-items-center" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px', borderColor: 'var(--sipdana-border-color)' }}> {/* Tambah border color */}
                  <User size={18} className="me-2" style={{ color: 'var(--sipdana-primary)'}}/> Edit Profile
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <AvatarPlaceholder username={username} />
                  </div>
                  {profileError && <Alert variant="danger" onClose={() => setProfileError(null)} dismissible>{profileError}</Alert>}
                  {profileSuccess && <Alert variant="success" onClose={() => setProfileSuccess(null)} dismissible>{profileSuccess}</Alert>}

                  <Form onSubmit={handleProfileSubmit}>
                    <Form.Group className="mb-3" controlId="formUsername">
                      <Form.Label style={{ color: 'var(--sipdana-gray-700)'}}>Username</Form.Label>
                      <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ borderRadius: '8px' }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label style={{ color: 'var(--sipdana-gray-700)'}}>Email</Form.Label>
                      <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ borderRadius: '8px' }}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mt-3 d-flex align-items-center justify-content-center gap-2" disabled={isEditingProfile} style={{ borderRadius: '8px' }}>
                      {isEditingProfile ? (<> <Spinner size="sm"/> Menyimpan... </>) : (<> <Save size={16} /> Simpan Profil </>)}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
                 <Card.Header className="bg-white fw-bold d-flex align-items-center" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px', borderColor: 'var(--sipdana-border-color)' }}> {/* Tambah border color */}
                  <Lock size={18} className="me-2" style={{ color: 'var(--sipdana-primary)'}}/> Ganti Password
                </Card.Header>
                <Card.Body className="p-4">
                  {passwordError && <Alert variant="danger" onClose={() => setPasswordError(null)} dismissible>{passwordError}</Alert>}
                  {passwordSuccess && <Alert variant="success" onClose={() => setPasswordSuccess(null)} dismissible>{passwordSuccess}</Alert>}

                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-3" controlId="formCurrentPassword">
                      <Form.Label style={{ color: 'var(--sipdana-gray-700)'}}>Password Saat Ini</Form.Label>
                      <Form.Control type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required style={{ borderRadius: '8px' }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formNewPassword">
                      <Form.Label style={{ color: 'var(--sipdana-gray-700)'}}>Password Baru</Form.Label>
                      <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ borderRadius: '8px' }}/>
                    </Form.Group>
                     <Form.Group className="mb-3" controlId="formConfirmPassword">
                      <Form.Label style={{ color: 'var(--sipdana-gray-700)'}}>Konfirmasi Password Baru</Form.Label>
                      <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ borderRadius: '8px' }} isInvalid={confirmPassword !== '' && newPassword !== confirmPassword}/>
                       <Form.Control.Feedback type="invalid"> Password tidak cocok. </Form.Control.Feedback>
                    </Form.Group>
                     <Button variant="outline-primary" type="submit" className="w-100 mt-3 d-flex align-items-center justify-content-center gap-2" disabled={isChangingPassword} style={{ borderRadius: '8px' }}>
                      {isChangingPassword ? (<> <Spinner size="sm"/> Memproses... </>) : (<> <Lock size={16} /> Ganti Password </>)}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

               <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                 <Card.Body className="p-4 d-grid">
                    <Button variant="danger" size="lg" onClick={handleLogout} className="d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: '8px' }}>
                       <LogOut size={18} /> Logout
                    </Button>
                 </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default ProfilePage;