import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
// Pastikan path service benar
import { type Transaksi } from '../../services/transaksiService';

interface TransactionListProps {
  transactions: Transaksi[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {

  const formatDate = (dateString: string) => {
    // Buat objek Date langsung dari timestamp/string tanggal
    const date = new Date(dateString);
    // Cek validitas
     if (isNaN(date.getTime())) {
        return "Tgl Invalid"; // Fallback jika tanggal tidak valid
     }
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      // year: 'numeric', // Mungkin tahun tidak perlu di list harian/mingguan
    });
  };

  // Helper format IDR (atau impor dari utils)
  const formatIDR = (value: number | undefined | null | string) => {
     const numValue = Number(value) || 0; // Pastikan number
     return new Intl.NumberFormat('id-ID', {
       style: 'currency',
       currency: 'IDR',
       minimumFractionDigits: 0,
       maximumFractionDigits: 0,
     }).format(numValue);
  };

  return (
    <div className="transaction-list-scrollable">
      <ListGroup variant="flush" className="w-100 transaction-list-inner">
        {transactions.map((trx) => (
          <ListGroup.Item
            key={trx.id_transaksi}
            className="d-flex justify-content-between align-items-center px-0 py-3" // px-0
          >
            {/* Sisi Kiri */}
            <div className="d-flex align-items-center">
              <div className="icon-placeholder me-3">
                 {/* TODO: Ganti dengan ikon kategori sebenarnya */}
                <span role="img" aria-label="kategori" style={{fontSize: '1.5rem'}}>📁</span>
              </div>
              <div>
                <h6 className="mb-0 fw-bold">{trx.nama_kategori}</h6>
                <small className="text-muted d-block" style={{ marginTop: '2px' }}>
                  {trx.keterangan || formatDate(trx.tanggal)}
                </small>
              </div>
            </div>

            {/* Sisi Kanan */}
            <div className="text-end">
              <h6
                className={`mb-1 fw-bold ${
                  trx.jenis === 'pemasukan' ? 'text-success' : 'text-danger'
                }`}
              >
                {trx.jenis === 'pemasukan' ? '+' : '-'}
                {/* === PERBAIKAN DI SINI === */}
                {formatIDR(trx.jumlah)} {/* Gunakan helper format */}
                {/* ========================== */}
              </h6>
              <Badge
                bg={trx.jenis === 'pemasukan' ? 'success-light' : 'danger-light'}
                className="small"
              >
                {trx.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
              </Badge>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TransactionList;