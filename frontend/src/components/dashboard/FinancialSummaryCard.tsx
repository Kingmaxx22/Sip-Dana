import React, { useState } from 'react';
import { Card, Row, Col, ButtonGroup, Button, Spinner } from 'react-bootstrap';
import { ChevronLeftIcon, ChevronRightIcon, EyeOpenIcon, EyeClosedIcon } from './IconsDashboard';
import { type FilterMode } from '../../utils/dateUtils';

interface SummaryData {
    income: number;
    expenses: number;
    total: number;
}

interface FinancialSummaryCardProps {
  summary: SummaryData;
  isLoading: boolean;
  displayDate: string;
  filterMode: FilterMode;
  onNavigateDate: (direction: 'prev' | 'next') => void;
  onChangeFilterMode: (mode: FilterMode) => void;
}

const formatIDR = (value: number | undefined | null | string) => {
   const numValue = Number(value) || 0;
   return new Intl.NumberFormat('id-ID', {
     style: 'currency',
     currency: 'IDR',
     minimumFractionDigits: 0,
     maximumFractionDigits: 0,
   }).format(numValue);
};

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  summary,
  isLoading,
  displayDate,
  filterMode,
  onNavigateDate,
  onChangeFilterMode
}) => {

  const [showAmounts, setShowAmounts] = useState(true);
  const { total, income, expenses } = summary;

  const formatAmount = (amount: number) => {
    if (isLoading) { return <Spinner animation="border" size="sm" variant="secondary" />; }
    if (!showAmounts) { return 'Rp •••'; }
    return formatIDR(amount);
  };

  return (
    <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: '15px', backgroundColor: 'var(--sipdana-secondary-light)' }}>
      <Card.Body>
        {/* Header (Navigasi Tanggal) */}
        <Row className="align-items-center mb-3">
          <Col xs={6} className="d-flex align-items-center">
             <span onClick={() => onNavigateDate('prev')} style={{ cursor: 'pointer', color: 'var(--sipdana-gray-600)' }} className="me-2"> <ChevronLeftIcon /> </span>
             <h5 className="mb-0 me-2 fw-bold" style={{ color: 'var(--sipdana-primary)'}}>{displayDate}</h5>
             <span onClick={() => onNavigateDate('next')} style={{ cursor: 'pointer', color: 'var(--sipdana-gray-600)' }}> <ChevronRightIcon /> </span>
          </Col>
          <Col xs={6} className="text-end">
            <span onClick={() => setShowAmounts(!showAmounts)} style={{ cursor: 'pointer', color: 'var(--sipdana-gray-600)' }}>
              {showAmounts ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </span>
          </Col>
        </Row>

        {/* === PERUBAHAN DI SINI: Layout Vertikal === */}
        <div className="mb-3">
          
          {/* 1. Income */}
          <div 
            className="d-flex justify-content-between align-items-center py-2 px-1" 
            style={{ borderBottom: '1px solid var(--sipdana-gray-300)' }}
          >
            <h6 className="text-muted small mb-0 text-uppercase">Income</h6>
            <h5 className="fw-bold mb-0" style={{ color: 'var(--sipdana-accent-green-base)' }}>
              {formatAmount(income)}
            </h5>
          </div>
          
          {/* 3. Expenses */}
          <div className="d-flex justify-content-between align-items-center py-2 px-1">
            <h6 className="text-muted small mb-0 text-uppercase">Expenses</h6>
            <h5 className="fw-bold mb-0" style={{ color: 'var(--sipdana-accent-red-base)' }}>
              {formatAmount(expenses)}
            </h5>
          </div>

          {/* 2. Total */}
          <div 
            className="d-flex justify-content-between align-items-center py-2 px-1" 
            style={{ borderBottom: '1px solid var(--sipdana-gray-300)' }}
          >
             <h6 className="text-muted small mb-0 text-uppercase">Total</h6>
            <h5 className="fw-bold mb-0" style={{ color: 'var(--sipdana-primary)' }}>
              {formatAmount(total)}
            </h5>
          </div>

        </div>
        {/* === BATAS PERUBAHAN === */}


        {/* Filter Buttons */}
        <ButtonGroup size="sm" className="w-100">
           <Button variant={filterMode === 'weekly' ? 'primary' : 'outline-primary'} onClick={() => onChangeFilterMode('weekly')} > Weekly </Button>
           <Button variant={filterMode === 'monthly' ? 'primary' : 'outline-primary'} onClick={() => onChangeFilterMode('monthly')} > Monthly </Button>
           <Button variant={filterMode === 'annual' ? 'primary' : 'outline-primary'} onClick={() => onChangeFilterMode('annual')} > Annual </Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
};

export default FinancialSummaryCard;