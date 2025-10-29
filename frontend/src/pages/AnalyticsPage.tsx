import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Form
} from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Filter, Download, BarChart3, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { transaksiService, type Transaksi } from '../services/transaksiService';
import { laporanService, type LaporanHarian } from '../services/laporanService';
import NoTransactionsYet from '../components/dashboard/NoTransactionsYet';
import TransactionList from '../components/dashboard/TransactionList';

const formatIDR = (value: number | undefined | null | string) => {
   const numValue = Number(value) || 0;
   return new Intl.NumberFormat('id-ID', {
     style: 'currency',
     currency: 'IDR',
     minimumFractionDigits: 0,
     maximumFractionDigits: 0
   }).format(numValue);
};

const AnalyticsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const [laporanHarian, setLaporanHarian] = useState<LaporanHarian[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'pemasukan' | 'pengeluaran'>('all');
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
        setError("Rentang tanggal tidak valid.");
        setIsLoading(false);
        setLaporanHarian([]);
        setRecentTransactions([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [laporanRes, transaksiRes] = await Promise.all([
          laporanService.getLaporan(startDate, endDate, 'Harian'),
          transaksiService.getFiltered(startDate, endDate, 5)
        ]);
        setLaporanHarian(laporanRes.data);
        setRecentTransactions(transaksiRes.data);
      } catch (err) {
        console.error('Gagal mengambil data analytics:', err);
        setError('Gagal memuat data.');
        setLaporanHarian([]);
        setRecentTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  const trendData = useMemo(() => {
    const trends: Record<string, { income: number; expense: number; originalDate: Date }> = {};
    laporanHarian.forEach((laporan) => {
      const originalDate = new Date(laporan.tanggal_laporan); 
      if (isNaN(originalDate.getTime())) {
        console.warn(`Tanggal laporan tidak valid dilewati: ${laporan.tanggal_laporan}`);
        return;
      }
      const dateKey = originalDate.toISOString().split('T')[0];
      
      if (!trends[dateKey]) {
        trends[dateKey] = { income: 0, expense: 0, originalDate: originalDate };
      }
      trends[dateKey].income += Number(laporan.totalPemasukan) || 0;
      trends[dateKey].expense += Number(laporan.totalPengeluaran) || 0;
    });
    return Object.values(trends)
      .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
      .map(item => ({
        date: item.originalDate.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
        income: item.income,
        expense: item.expense
      }));
  }, [laporanHarian]);

  const filteredRecentTransactions = useMemo(() => {
    if (filterType === 'all') return recentTransactions;
    return recentTransactions.filter((t) => t.jenis === filterType);
  }, [recentTransactions, filterType]);

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Memuat...</p>
        </div>
      );
    }
    if (error && laporanHarian.length === 0 && recentTransactions.length === 0) {
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
            <Alert.Heading as="h6" className="mb-1 fw-bold">Error</Alert.Heading>
            <p className="mb-0 small">{error}</p>
          </div>
        </Alert>
      );
    }
    if (laporanHarian.length === 0 && recentTransactions.length === 0 && !isLoading) {
      return (
        <Card className="shadow-sm border-0" style={{ minHeight: '60vh', borderRadius: '15px' }}>
          <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center">
            <NoTransactionsYet />
            <p className="text-muted mt-3 text-center">Tidak ada data.</p>
          </Card.Body>
        </Card>
      );
    }

    return (
      <>
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <Card.Header
                className="bg-white border-bottom d-flex justify-content-between align-items-center"
                style={{ borderRadius: '12px 12px 0 0' }}
              >
                <h6 className="mb-0 fw-bold">📈 Grafik</h6>
              </Card.Header>
              <Card.Body className="p-4">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--sipdana-border-color)" />
                      <XAxis dataKey="date" stroke="var(--sipdana-gray-600)" fontSize="0.75rem"/>
                      <YAxis
                        stroke="var(--sipdana-gray-600)"
                        fontSize="0.75rem"
                        tickFormatter={(value) => formatIDR(value)}
                        width={100}
                        allowDataOverflow={false}
                      />
                      <Tooltip
                        formatter={(value: number) => [formatIDR(value), undefined]}
                        labelFormatter={(label) => `Tanggal: ${label}`}
                      />
                      <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: "10px" }}/>
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="var(--sipdana-accent-green-base)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Pemasukan"
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="var(--sipdana-accent-red-base)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Pengeluaran"
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : ( <p className="text-muted text-center py-5 mb-0">Tidak ada data grafik.</p> )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
         <Row>
           <Col>
             <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
               <Card.Header
                 className="bg-white border-bottom d-flex justify-content-between align-items-center"
                 style={{ borderRadius: '12px 12px 0 0' }}
               >
                 <h6 className="mb-0 fw-bold">📋 Transaksi Terbaru (Filter)</h6>
               </Card.Header>
               <Card.Body className="p-4">
                 {filteredRecentTransactions.length > 0 ? (
                   <TransactionList transactions={filteredRecentTransactions} />
                 ) : (
                   <p className="text-muted text-center py-5 mb-0">
                     Tidak ada transaksi '{filterType !== 'all' ? filterType : ''}'.
                   </p>
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
      <Header onToggleSidebar={toggleSidebar} title="Analytics" />
      <main
        className="flex-grow-1"
        style={{
          backgroundColor: 'var(--sipdana-body-bg)',
          paddingTop: '1.5rem',
          paddingBottom: '2rem'
        }}
      >
        <Container fluid="lg">
           <Row className="mb-4 align-items-center">
             <Col>
               <div>
                 <h2
                   className="mb-1 fw-bold d-flex align-items-center"
                   style={{ color: 'var(--sipdana-gray-900)' }}
                 >
                   <BarChart3
                     size={30}
                     className="me-2"
                     style={{ marginBottom: '2px', color: 'var(--sipdana-primary)' }}
                   />
                   Analytics
                 </h2>
                 <p
                   className="mb-0 small"
                   style={{ color: 'var(--sipdana-gray-600)' }}
                 >
                   Analisis detail keuangan Anda
                 </p>
               </div>
             </Col>
           </Row>
           <Row className="mb-4">
             <Col>
               <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                 <Card.Body>
                   <Form className="d-flex gap-3 flex-wrap align-items-end">
                     <Form.Group className="flex-grow-1" style={{ minWidth: '150px' }}>
                       <Form.Label
                         className="fw-semibold small mb-1"
                         style={{ color: 'var(--sipdana-gray-700)'}}
                       >
                         Dari
                       </Form.Label>
                       <Form.Control
                         type="date"
                         value={startDate}
                         onChange={(e) => setStartDate(e.target.value)}
                         size="sm"
                         style={{ borderRadius: '8px' }}
                       />
                     </Form.Group>
                     <Form.Group className="flex-grow-1" style={{ minWidth: '150px' }}>
                       <Form.Label
                         className="fw-semibold small mb-1"
                         style={{ color: 'var(--sipdana-gray-700)'}}
                       >
                         Sampai
                       </Form.Label>
                       <Form.Control
                         type="date"
                         value={endDate}
                         onChange={(e) => setEndDate(e.target.value)}
                         size="sm"
                         style={{ borderRadius: '8px' }}
                       />
                     </Form.Group>
                     <Form.Group className="flex-grow-1" style={{ minWidth: '150px' }}>
                       <Form.Label
                         className="fw-semibold small mb-1"
                         style={{ color: 'var(--sipdana-gray-700)'}}
                       >
                         Tipe
                       </Form.Label>
                       <Form.Select
                         value={filterType}
                         onChange={(e) => setFilterType(e.target.value as any)}
                         size="sm"
                         style={{ borderRadius: '8px' }}
                       >
                         <option value="all">Semua</option>
                         <option value="pemasukan">Pemasukan</option>
                         <option value="pengeluaran">Pengeluaran</option>
                       </Form.Select>
                     </Form.Group>
                   </Form>
                 </Card.Body>
               </Card>
             </Col>
           </Row>
          {renderMainContent()}
        </Container>
      </main>
    </div>
  );
};

export default AnalyticsPage;