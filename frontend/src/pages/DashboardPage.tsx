import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import FinancialSummaryCard from '../components/dashboard/FinancialSummaryCard';
import NoTransactionsYet from '../components/dashboard/NoTransactionsYet';
import AddTransactionButton from '../components/dashboard/AddTransactionButton';
import TransactionList from '../components/dashboard/TransactionList';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { transaksiService, type Transaksi } from '../services/transaksiService';
import { laporanService, type LaporanHarian } from '../services/laporanService';
import {
  calculateDateRange,
  navigateDate,
  type FilterMode
} from '../utils/dateUtils';
import { LayoutDashboard } from 'lucide-react';

const formatIDR = (value: number | undefined | null | string) => {
   const numValue = Number(value) || 0;
   return new Intl.NumberFormat('id-ID', {
     style: 'currency',
     currency: 'IDR',
     minimumFractionDigits: 0,
     maximumFractionDigits: 0
   }).format(numValue);
};

const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const [filterMode, setFilterMode] = useState<FilterMode>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [transactions, setTransactions] = useState<Transaksi[]>([]);
  const [laporanData, setLaporanData] = useState<LaporanHarian[]>([]);
  const [isLoadingTransaksi, setIsLoadingTransaksi] = useState(true);
  const [isLoadingLaporan, setIsLoadingLaporan] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { startDate, endDate, display } = useMemo(
    () => calculateDateRange(currentDate, filterMode),
    [currentDate, filterMode]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingLaporan(true);
      setIsLoadingTransaksi(true);
      setError(null);
      if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
        setError("Invalid date range.");
        setIsLoadingLaporan(false);
        setIsLoadingTransaksi(false);
        setLaporanData([]);
        setTransactions([]);
        return;
      }
      try {
        const [laporanRes, transaksiRes] = await Promise.all([
          laporanService.getLaporan(startDate, endDate, 'Harian'),
          transaksiService.getFiltered(startDate, endDate, 10)
        ]);
        setLaporanData(laporanRes.data);
        setTransactions(transaksiRes.data);
      } catch (err) {
        console.error('Failed fetch dashboard data:', err);
        setError('Failed to load data.');
        setLaporanData([]);
        setTransactions([]);
      } finally {
        setIsLoadingLaporan(false);
        setIsLoadingTransaksi(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  const handleDateNavigate = (direction: 'prev' | 'next') => {
    setCurrentDate(navigateDate(currentDate, filterMode, direction));
  };
  const handleChangeFilterMode = (mode: FilterMode) => {
    setFilterMode(mode);
  };

   const summaryTotals = useMemo(() =>
     laporanData.reduce((acc, harian) => {
       acc.income += Number(harian.totalPemasukan) || 0;
       acc.expenses += Number(harian.totalPengeluaran) || 0;
       return acc;
     }, { income: 0, expenses: 0 }),
   [laporanData]);

   const totalSaldoPeriode = summaryTotals.income - summaryTotals.expenses;

  const renderMainContent = () => {
    if (isLoadingTransaksi || isLoadingLaporan) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{minHeight: '200px'}}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }
    if (error && transactions.length === 0) {
      return <Alert variant="danger" className="text-center">{error}</Alert>;
    }
    if (transactions.length > 0) {
      return <TransactionList transactions={transactions} />;
    }
    if (laporanData.length === 0 && !isLoadingLaporan) {
      return <NoTransactionsYet />;
    }
    return <p className="text-muted text-center">No transactions found.</p>;
  };

  const shouldCenterContent = !isLoadingTransaksi &&
                             !isLoadingLaporan &&
                             transactions.length === 0 &&
                             laporanData.length === 0 &&
                             !error;
  const cardBodyClass = shouldCenterContent
    ? "p-4 d-flex flex-column align-items-center justify-content-center"
    : "p-4";
  const cardHeaderClass = shouldCenterContent ? "text-center" : "";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <Header onToggleSidebar={toggleSidebar} title="Dashboard" />
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
                  <LayoutDashboard
                    size={30}
                    className="me-2"
                    style={{ marginBottom: '2px', color: 'var(--sipdana-primary)' }}
                  />
                  Dashboard Utama
                </h2>
                <p
                  className="mb-0 small"
                  style={{ color: 'var(--sipdana-gray-600)'}}
                >
                  Ringkasan aktivitas keuangan Anda
                </p>
              </div>
            </Col>
          </Row>
          <Row className="g-4">
            <Col lg={8} className="order-2 order-lg-1">
              <Card
                className="shadow-sm border-0"
                style={{ minHeight: '70vh', borderRadius: '15px' }}
              >
                <Card.Header
                  className={`fw-bold ${cardHeaderClass}`}
                  style={{
                    backgroundColor: 'var(--sipdana-white)',
                    borderBottom: '1px solid var(--sipdana-border-color)',
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px'
                  }}
                >
                  Riwayat Transaksi ({display})
                </Card.Header>
                {/* INI PERBAIKANNYA */}
                <Card.Body className={cardBodyClass}>
                  {renderMainContent()}
                </Card.Body>
                {/* BATAS PERBAIKAN */}
              </Card>
            </Col>
            <Col lg={4} className="order-1 order-lg-2">
              <FinancialSummaryCard
                summary={{
                  income: summaryTotals.income,
                  expenses: summaryTotals.expenses,
                  total: totalSaldoPeriode
                }}
                isLoading={isLoadingLaporan}
                displayDate={display}
                filterMode={filterMode}
                onNavigateDate={handleDateNavigate}
                onChangeFilterMode={handleChangeFilterMode}
              />
            </Col>
          </Row>
          <AddTransactionButton />
        </Container>
      </main>
    </div>
  );
};

export default DashboardPage;