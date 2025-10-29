import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  ProgressBar,
  Badge,
} from 'react-bootstrap';
// Import only necessary icons
import {
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  AlertCircle,
  Gift,
  Wallet,
} from 'lucide-react';

// Impor layout
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

// Impor Service & Tipe
import {
  rekomendasiService,
  type WeeklySavingsRec,
} from '../services/rekomendasiService'; // Ensure filename is correct

// StatCard Component (Should be correct from previous fix)
const StatCard: React.FC<{
  title: string;
  amount: number; // Keep amount as number
  colorVar: string;
  icon: React.ReactNode;
}> = ({ title, amount, colorVar, icon }) => {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0); // Format amount, default 0 if null/undefined/NaN

  return (
    <Card
      className="border-0 shadow-sm h-100 text-white"
      style={{ borderRadius: '12px', backgroundColor: `var(${colorVar})` }}
    >
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ flex: 1 }}>
            <p className="mb-1 text-uppercase" style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.8 }} >
              {title}
            </p>
            <h4 className="fw-bold mb-0" style={{ fontSize: '1.6rem' }}>
              {formattedAmount}
            </h4>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', width: '45px', height: '45px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }} >
            {icon}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};


const TargetMenabungPage: React.FC = () => {
  // State sidebar, data, loading, error
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const [report, setReport] = useState<WeeklySavingsRec | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data (CORRECTED: Use getLatestWeeklySavings)
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true); setError(null);
        // === FIX 1: Call the correct function ===
        const response = await rekomendasiService.getLatestWeeklySavings();
        // =======================================
        setReport(response.data);
      } catch (err: any) {
         if (err.response && err.response.status === 404) {
             setReport({ totalPemasukan: 0, totalPengeluaran: 0, saldoMingguan: 0, rekomendasiTeks: "Belum ada laporan tersimpan.", targetMenabung: null });
         } else {
            console.error('Gagal mengambil laporan:', err);
            setError('Gagal memuat laporan mingguan.');
         }
      } finally { setIsLoading(false); }
    };
    fetchReport();
  }, []);

  // Calculate savings percentage (CORRECTED: Handle null saldoMingguan)
  const calculateSavingsPercentage = () => {
     // === FIX 2: Check for null report or target, ensure saldoMingguan is number ===
     const saldoMingguan = Number(report?.saldoMingguan) || 0; // Convert to number, default 0
     const targetMenabung = report?.targetMenabung;

     if (!report || !targetMenabung || targetMenabung <= 0 || saldoMingguan <= 0) return 0;
     // =========================================================================

     // Calculate how much of the target has been achieved by the surplus
     const percentage = (saldoMingguan / targetMenabung) * 100;
     return Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
  };

  // Helper format IDR
   const formatIDR = (value: number | undefined | null | string) => {
     const numValue = Number(value) || 0;
     return new Intl.NumberFormat('id-ID', {
       style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
     }).format(numValue);
   };

  // Render content function
  const renderContent = () => {
    // Loading and Error states
     if (isLoading) { return ( <div className="text-center py-5"><Spinner animation="border" variant="primary" className="mb-3" /><p className="text-muted">Menyusun laporan...</p></div> ); }
     if (error) { return ( <Alert variant="" className="border-0 d-flex align-items-center shadow-sm" style={{ borderRadius: '12px', backgroundColor: 'var(--sipdana-accent-red-bg-light)', color: 'var(--sipdana-accent-red-text)' }}> <AlertCircle size={20} className="me-2 flex-shrink-0" style={{ color: 'var(--sipdana-accent-red-base)' }} /> <div> <Alert.Heading as="h6" className="mb-1 fw-bold">Error</Alert.Heading> <p className="mb-0 small">{error}</p> </div> </Alert> ); }
     if (!report) { return ( <Alert variant="" className="border-0 d-flex align-items-center shadow-sm" style={{ borderRadius: '12px', backgroundColor: 'var(--sipdana-accent-yellow-bg-light)', color: 'var(--sipdana-accent-yellow-text)' }}> <AlertCircle size={20} className="me-2 flex-shrink-0" style={{ color: 'var(--sipdana-accent-yellow-base)' }}/> <div> <Alert.Heading as="h6" className="mb-1 fw-bold">Info</Alert.Heading> <p className="mb-0 small">Tidak dapat memuat data.</p> </div> </Alert> ); }

    // Main Content (If report exists)
    const savingsPercentage = calculateSavingsPercentage();
    // === FIX 3: Ensure saldoMingguan is treated as number for comparison ===
    const saldoMingguanNum = Number(report.saldoMingguan) || 0;
    const isSurplus = saldoMingguanNum >= 0;
    // =====================================================================

    return (
      <>
        {/* Stat Cards Row - Ensure amount passed is number */}
        <Row className="mb-4 g-3">
             <Col lg={4} md={6}> <StatCard title="PEMASUKAN (7 Hari)" amount={Number(report.totalPemasukan) || 0} colorVar="--sipdana-accent-green-base" icon={<TrendingUp size={24} />} /> </Col>
             <Col lg={4} md={6}> <StatCard title="PENGELUARAN (7 Hari)" amount={Number(report.totalPengeluaran) || 0} colorVar="--sipdana-accent-red-base" icon={<TrendingDown size={24} />} /> </Col>
             <Col lg={4} md={12}> <StatCard title={isSurplus ? 'SISA DANA (SURPLUS)' : 'SISA DANA (DEFISIT)'} amount={Math.abs(saldoMingguanNum)} colorVar={isSurplus ? "--sipdana-primary" : "--sipdana-accent-red-base"} icon={<Wallet size={24} />} /> </Col>
        </Row>

        {/* Main Content Row */}
        <Row className="mb-4 g-4">
          {/* Left Column: Weekly Report & Analysis */}
          <Col lg={7}>
            {/* Weekly Report Card */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
              <Card.Header className="border-0 fw-bold d-flex align-items-center gap-2" style={{ backgroundColor: 'var(--sipdana-primary)', color: 'var(--sipdana-white)', borderRadius: '16px 16px 0 0', padding: '1.25rem 1.5rem', }}>
                 {/* Calendar Icon removed as it's not imported */}
                Laporan 7 Hari
              </Card.Header>
              <Card.Body className="p-4">
                {/* Detail Laporan */}
                <div className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--sipdana-border-color)'}}>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-500 d-flex align-items-center gap-2" style={{ color: 'var(--sipdana-gray-700)'}}> <TrendingUp size={16} style={{ color: 'var(--sipdana-accent-green-base)'}} /> Total Pemasukan </span>
                        <span className="fw-bold" style={{ color: 'var(--sipdana-accent-green-base)'}}>
                           +{formatIDR(report.totalPemasukan)}
                        </span>
                    </div>
                </div>
                 <div className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--sipdana-border-color)'}}>
                    <div className="d-flex justify-content-between align-items-center">
                         <span className="fw-500 d-flex align-items-center gap-2" style={{ color: 'var(--sipdana-gray-700)'}}> <TrendingDown size={16} style={{ color: 'var(--sipdana-accent-red-base)'}} /> Total Pengeluaran </span>
                        <span className="fw-bold" style={{ color: 'var(--sipdana-accent-red-base)'}}>
                           -{formatIDR(report.totalPengeluaran)}
                        </span>
                    </div>
                </div>
                 <div>
                    <div className="d-flex justify-content-between align-items-center">
                         <span className="fw-600 d-flex align-items-center gap-2" style={{ color: 'var(--sipdana-primary)'}}> <Wallet size={16} /> Sisa Dana </span>
                        <span className={`fw-bold fs-5 ${isSurplus ? 'text-success' : 'text-danger'}`}>
                             {isSurplus ? '+' : '-'}{formatIDR(Math.abs(saldoMingguanNum))}
                        </span>
                    </div>
                </div>
              </Card.Body>
            </Card>

            {/* Analysis Card */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', backgroundColor: 'var(--sipdana-secondary-light)' }}>
               <Card.Body className="p-4"> <div className="d-flex align-items-start gap-3 mb-3">
                   {/* Zap Icon removed as it's not imported */}
                   <div style={{ backgroundColor: 'var(--sipdana-primary)', width: '45px', height: '45px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sipdana-white)', flexShrink: 0, }}> <TrendingUp size={24}/> {/* Example replacement */} </div>
                   <div> <h6 className="fw-bold mb-1" style={{ color: 'var(--sipdana-primary)' }}>Analisis Mingguan</h6> <p className="mb-0 small" style={{ color: 'var(--sipdana-gray-600)' }}> Insight keuangan </p> </div>
               </div> <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: 'var(--sipdana-gray-700)' }}> {report.rekomendasiTeks || 'Pantau pengeluaran Anda.'} </p> </Card.Body>
            </Card>
          </Col>

          {/* Right Column: Target Savings */}
          <Col lg={5}>
             <Card className="border-0 shadow-lg h-100" style={{ borderRadius: '16px', backgroundColor: 'var(--sipdana-accent-green-bg-light)' }}>
                <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center">
                    <div style={{ backgroundColor: 'var(--sipdana-accent-green-base)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--sipdana-white)', }}> <Gift size={32} /> </div>
                    <h5 className="fw-bold text-center" style={{ color: 'var(--sipdana-accent-green-text)', marginBottom: '0.5rem' }}> 🎯 TARGET TABUNGAN MINGGU INI </h5>
                    {report.targetMenabung !== null ? (
                        <>
                            <div className="text-center bg-white p-3 rounded-3 shadow-sm mb-4 w-100" style={{ border: '1px solid var(--sipdana-border-color)'}}>
                                <p className="small fw-bold text-uppercase" style={{ color: 'var(--sipdana-accent-green-text)', marginBottom: '0.25rem' }}> Target Rekomendasi </p>
                                <h3 className="fw-bold" style={{ color: 'var(--sipdana-accent-green-base)', margin: 0, fontSize: '1.8rem' }}> {formatIDR(report.targetMenabung)} </h3>
                            </div>
                            <div className="w-100 mb-3 text-center">
                                <p className="small fw-bold mb-1" style={{ color: 'var(--sipdana-gray-700)' }}>Progress Menabung ({Math.round(savingsPercentage)}%)</p>
                                <ProgressBar now={savingsPercentage} variant="success" style={{ height: '12px', borderRadius: '6px', backgroundColor: 'var(--sipdana-gray-200)' }} />
                                <small className="d-block mt-2" style={{ color: 'var(--sipdana-gray-600)'}}> Anda memiliki sisa dana {formatIDR(saldoMingguanNum > 0 ? saldoMingguanNum : 0)}. </small>
                            </div>
                            <Alert variant={isSurplus ? "success" : "warning"} className="w-100 text-center small border-0" style={{ borderRadius: '8px' }}> {isSurplus ? "🎉 Selamat! Anda bisa menabung!" : "⚠️ Perhatikan pengeluaran untuk menabung."} </Alert>
                        </>
                    ) : (
                        <p className="text-muted text-center mt-3"> Belum ada target menabung yang direkomendasikan minggu ini. </p>
                    )}
                </Card.Body>
             </Card>
          </Col>
        </Row>
      </>
    );
  };

  return (
     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
       <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
       <Header onToggleSidebar={toggleSidebar} title="Target Menabung" />
       <main className="flex-grow-1" style={{ backgroundColor: 'var(--sipdana-body-bg)', paddingTop: '2rem', paddingBottom: '2rem' }} >
         <Container fluid="lg">
           <Row className="mb-4">
              <Col>
                 <div>
                   <h2 className="mb-2 fw-bold" style={{ color: 'var(--sipdana-gray-900)' }}>
                      <Target size={32} className="me-2 d-inline" style={{ marginBottom: '4px', color: 'var(--sipdana-primary)' }} /> Target Menabung
                   </h2>
                   <p className="mb-0" style={{ color: 'var(--sipdana-gray-600)' }}> Pantau progress tabungan mingguan Anda </p>
                 </div>
              </Col>
           </Row>
          {renderContent()}
         </Container>
       </main>
     </div>
  );
};

export default TargetMenabungPage;