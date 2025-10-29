import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge,
  Button,
} from 'react-bootstrap';
import {
  Lightbulb,
  TrendingUp,
  Wallet,
  CheckCircle,
  Zap,
  BookOpen,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import {
  rekomendasiService,
  type SpendingHabitRec,
} from '../services/rekomendasiService';

const formatIDR = (value: number | undefined | null | string) => {
   const numValue = Number(value) || 0;
   return new Intl.NumberFormat('id-ID', {
     style: 'currency',
     currency: 'IDR',
     minimumFractionDigits: 0,
     maximumFractionDigits: 0
   }).format(numValue);
};

const MetodeMengelolaPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const [recommendation, setRecommendation] = useState<SpendingHabitRec | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await rekomendasiService.getLatestSpendingHabit();
        setRecommendation(response.data);
      } catch (err: any) {
         if (err.response && err.response.status === 404) {
           setRecommendation({
             rekomendasi: "Belum ada rekomendasi tersimpan. Mulai catat transaksi!",
             metode: null
           });
         } else {
           console.error('Gagal mengambil rekomendasi:', err);
           setError('Gagal memuat rekomendasi.');
         }
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendation();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Menganalisis kebiasaan...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          variant=""
          className="border-0 d-flex align-items-center shadow-sm"
          style={{
            borderRadius: '12px',
            backgroundColor: 'var(--sipdana-accent-red-bg-light)',
            color: 'var(--sipdana-accent-red-text)'
          }}
        >
          <AlertCircle
            size={20}
            className="me-2 flex-shrink-0"
            style={{ color: 'var(--sipdana-accent-red-base)' }}
          />
          <div>
            <Alert.Heading as="h6" className="mb-1 fw-bold">Terjadi Kesalahan</Alert.Heading>
            <p className="mb-0 small">{error}</p>
          </div>
        </Alert>
      );
    }

    if (!recommendation || !recommendation.metode) {
      return (
        <Card
          className="border-0 shadow-sm text-center"
          style={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--sipdana-gradient-start) 0%, var(--sipdana-gradient-end) 100%)',
            color: 'var(--sipdana-white)',
          }}
        >
          <Card.Body className="p-5">
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.8 }}>📊</div>
            <h4 className="fw-bold mb-3">Belum Ada Rekomendasi</h4>
            <p className="mb-3 fs-5" style={{ opacity: 0.9 }}>
              {recommendation?.rekomendasi || "Kami butuh data transaksi untuk memberi rekomendasi."}
            </p>
            {!recommendation?.rekomendasi.includes("tersimpan") &&
             <p className="mb-0 opacity-75 small"> Mulai catat transaksimu! </p>
            }
          </Card.Body>
        </Card>
      );
    }

    return (
      <>
        <Card
          className="border-0 shadow-lg mb-4"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--sipdana-gradient-start) 0%, var(--sipdana-gradient-end) 100%)',
            color: 'var(--sipdana-white)',
          }}
        >
           <Card.Body className="p-5">
             <div className="d-flex align-items-start gap-3 mb-4">
               <div
                 style={{
                   background: 'rgba(255,255,255,0.2)',
                   width: '60px',
                   height: '60px',
                   borderRadius: '12px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   flexShrink: 0,
                 }}
               >
                 <Lightbulb size={32} />
               </div>
               <div>
                 <h5 className="mb-1" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                   REKOMENDASI
                 </h5>
                 <h3 className="fw-bold mb-0">💡 Kebiasaan Cerdas</h3>
               </div>
             </div>
             <p
               style={{
                 fontSize: '1.1rem',
                 lineHeight: '1.6',
                 marginBottom: 0,
                 opacity: 0.95,
               }}
             >
               {recommendation.rekomendasi}
             </p>
           </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <Card.Header
              className="border-0 fw-bold d-flex align-items-center gap-2"
              style={{
                backgroundColor: 'var(--sipdana-primary)',
                color: 'var(--sipdana-white)',
                borderRadius: '16px 16px 0 0',
                padding: '1.25rem 1.5rem',
              }}
            >
              <Zap size={20} /> Metode yang Disarankan
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex align-items-start gap-3 mb-3">
                <div
                  style={{
                    backgroundColor: 'var(--sipdana-primary)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sipdana-white)',
                    flexShrink: 0,
                  }}
                >
                  <TrendingUp size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <h5 className="fw-bold mb-1" style={{ color: 'var(--sipdana-primary)'}}>
                    {recommendation.metode.namaMetode}
                  </h5>
                  <Badge
                    bg=""
                    className="mb-2"
                    style={{
                      backgroundColor: 'var(--sipdana-accent-green-bg-light)',
                      color: 'var(--sipdana-accent-green-text)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontWeight: 600
                    }}
                  >
                    <CheckCircle size={12} className="me-1 d-inline" /> Direkomendasikan
                  </Badge>
                </div>
              </div>
              <p
                className="mb-0"
                style={{
                  lineHeight: '1.6',
                  fontSize: '0.95rem',
                  color: 'var(--sipdana-gray-700)'
                }}
              >
                {recommendation.metode.deskripsiMetode}
              </p>
            </Card.Body>
        </Card>

        <Row className="mb-4 g-3">
             <Col md={6}>
               <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                 <Card.Body className="p-4">
                   <div className="d-flex align-items-start gap-3">
                     <div
                       style={{
                         backgroundColor: 'var(--sipdana-secondary-light)',
                         width: '45px',
                         height: '45px',
                         borderRadius: '8px',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: 'var(--sipdana-primary)',
                         flexShrink: 0,
                       }}
                     >
                       <Wallet size={24} />
                     </div>
                     <div>
                       <h6 className="fw-bold mb-1" style={{ color: 'var(--sipdana-gray-900)' }}>
                         Kontrol Pengeluaran
                       </h6>
                       <p className="mb-0" style={{ fontSize: '0.9rem', color: 'var(--sipdana-gray-600)' }}>
                         Kelola budget
                       </p>
                     </div>
                   </div>
                 </Card.Body>
               </Card>
             </Col>
             <Col md={6}>
               <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                 <Card.Body className="p-4">
                   <div className="d-flex align-items-start gap-3">
                     <div
                       style={{
                         backgroundColor: 'var(--sipdana-accent-green-bg-light)',
                         width: '45px',
                         height: '45px',
                         borderRadius: '8px',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: 'var(--sipdana-accent-green-base)',
                         flexShrink: 0,
                       }}
                     >
                       <TrendingUp size={24} />
                     </div>
                     <div>
                       <h6 className="fw-bold mb-1" style={{ color: 'var(--sipdana-gray-900)' }}>
                         Tingkatkan Tabungan
                       </h6>
                       <p className="mb-0" style={{ fontSize: '0.9rem', color: 'var(--sipdana-gray-600)' }}>
                         Investasi masa depan
                       </p>
                     </div>
                   </div>
                 </Card.Body>
               </Card>
             </Col>
        </Row>

        <Card
          className="border-0 shadow-sm"
          style={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--sipdana-accent-green-bg-light) 0%, var(--sipdana-secondary-light) 100%)',
            color: 'var(--sipdana-gray-700)',
          }}
        >
           <Card.Body className="p-4">
             <div className="d-flex align-items-start gap-3 mb-3">
               <BookOpen size={24} style={{ color: 'var(--sipdana-accent-green-base)'}} className="flex-shrink-0" />
               <h5 className="fw-bold mb-0" style={{ color: 'var(--sipdana-accent-green-text)'}}>
                 Tips Implementasi
               </h5>
             </div>
             <ul style={{ fontSize: '0.95rem', lineHeight: '1.8', marginBottom: 0, paddingLeft: '20px' }}>
               <li className="mb-2"><strong>Catat transaksi</strong></li>
               <li className="mb-2"><strong>Groupkan pengeluaran</strong></li>
               <li className="mb-2"><strong>Review mingguan</strong></li>
               <li><strong>Sesuaikan budget</strong></li>
             </ul>
           </Card.Body>
        </Card>

        <div className="mt-5 d-grid gap-2">
          <Button
            size="lg"
            className="btn-sipdana-primary"
            style={{
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600'
            }}
            href="/dashboard"
          >
            Lihat Dashboard <ChevronRight size={18} className="ms-2 d-inline" />
          </Button>
        </div>
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <Header onToggleSidebar={toggleSidebar} title="Metode Mengelola" />
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
                <h2
                  className="mb-2 fw-bold"
                  style={{ color: 'var(--sipdana-gray-900)'}}
                >
                  <BookOpen
                    size={32}
                    className="me-2 d-inline"
                    style={{ marginBottom: '4px', color: 'var(--sipdana-primary)' }}
                  />
                  Metode Mengelola Keuangan
                </h2>
                <p className="mb-0" style={{ color: 'var(--sipdana-gray-600)'}}>
                  Rekomendasi personal untuk optimalkan pengeluaran
                </p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col lg={10} xl={9}>
              {renderContent()}
            </Col>
          </Row>
           {recommendation && recommendation.metode && (
            <Row className="mt-5 justify-content-center">
              <Col lg={10} xl={9}>
                <Alert
                  variant=""
                  className="border-0 d-flex align-items-start shadow-sm"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: 'var(--sipdana-secondary-light)',
                    color: 'var(--sipdana-gray-700)',
                  }}
                >
                  <AlertCircle
                    size={18}
                    style={{ color: 'var(--sipdana-primary)'}}
                    className="me-2 flex-shrink-0 mt-1"
                  />
                  <div>
                    <Alert.Heading as="h6" className="mb-1 fw-bold" style={{ color: 'var(--sipdana-primary)'}}>
                      💡 Pro Tip
                    </Alert.Heading>
                    <small>
                      Semakin sering catat transaksi, semakin akurat rekomendasi.
                    </small>
                  </div>
                </Alert>
              </Col>
            </Row>
           )}
        </Container>
      </main>
    </div>
  );
};

export default MetodeMengelolaPage;