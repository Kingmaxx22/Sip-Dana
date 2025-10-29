import React, { useState, useEffect } from 'react';
import { Container,Row,Col,Card,Button,Form,Spinner,Alert,Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft,Calendar,DollarSign, Tag,MessageSquare,CheckCircle, AlertCircle,TrendingUp, TrendingDown } from 'lucide-react';
import { BackArrowIcon } from '../components/common/Icons'; 
import { kategoriService, type Kategori } from '../services/kategoriService';
import { transaksiService, type TransaksiData } from '../services/transaksiService';
import { CheckCircleIcon, ErrorCircleIcon } from '../components/dashboard/IconsDashboard';

const AddTransactionPage: React.FC = () => {
  const navigate = useNavigate();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [jenis, setJenis] = useState<'pemasukan' | 'pengeluaran' | ''>('');
  const [jumlah, setJumlah] = useState('');
  const [idKategori, setIdKategori] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  useEffect(() => {
    const fetchKategori = async () => { 
        try { const response = await kategoriService.getAll(); setKategoriList(response.data); } catch (err) { console.error('Gagal mengambil kategori:', err); setError('Gagal memuat kategori.'); }
    };
    fetchKategori();
  }, []);

  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => { const rawValue = e.target.value.replace(/[^0-9]/g, ''); setJumlah(rawValue); };
  const formatDisplayJumlah = (value: string): string => { if (!value) return ''; return parseInt(value, 10).toLocaleString('id-ID'); };
  const parseJumlah = (rawNumString: string): number => { return parseInt(rawNumString, 10) || 0; };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setModalErrorMessage('');
    if (!tanggal || !jenis || !jumlah || !idKategori) { setModalErrorMessage('Mohon lengkapi field wajib.'); setShowErrorModal(true); return; }
    const parsedJumlah = parseJumlah(jumlah);
    if (isNaN(parsedJumlah) || parsedJumlah <= 0) { setModalErrorMessage('Jumlah harus angka positif.'); setShowErrorModal(true); return; }
    setLoading(true);
    const data: TransaksiData = { tanggal, jenis, jumlah: parsedJumlah, id_kategori: parseInt(idKategori), keterangan };
    try { await transaksiService.create(data); setLoading(false); setShowSuccessModal(true); } catch (err: any) { setLoading(false); const apiError = err.response?.data?.message || 'Gagal menyimpan.'; setModalErrorMessage(apiError); setShowErrorModal(true); }
  };

  const handleCloseSuccess = () => { setShowSuccessModal(false); navigate('/dashboard'); };
  const handleCloseError = () => { setShowErrorModal(false); };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--sipdana-body-bg)' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--sipdana-gradient-start) 0%, var(--sipdana-gradient-end) 100%)', padding: '1.5rem', color: 'var(--sipdana-white)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', }} >
        <Container fluid="lg">
          <div className="d-flex align-items-center justify-content-between" style={{ gap: '1rem' }} >
            <button onClick={() => navigate(-1)} className="btn-header-icon" >
               <BackArrowIcon />
            </button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>
                Catat Transaksi Baru
              </h2>
            </div>
             <div style={{ width: '40px' }}></div>
          </div>
        </Container>
      </div>

      <Container fluid="lg" className="py-4">
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <Card.Body className="p-4 p-md-5">
                 {error && !showErrorModal && (<Alert variant="danger" className="mb-4 d-flex align-items-center"><AlertCircle size={18} className="me-2" /> {error}</Alert>)}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold mb-2 d-flex align-items-center small text-muted">
                      <Calendar size={16} className="me-2" style={{ color: 'var(--sipdana-primary)' }} /> Tanggal Transaksi
                    </Form.Label>
                    <Form.Control type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} disabled={loading} required style={{ borderRadius: '8px', borderColor: 'var(--sipdana-border-color)' }} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold mb-2 d-flex align-items-center small text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tags-fill me-2" viewBox="0 0 16 16" style={{ color: 'var(--sipdana-primary)' }}>
                        <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V3a1 1 0 0 1-1-1zm4 3.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                        <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z"/>
                      </svg>
                      Jenis Transaksi
                    </Form.Label>
                    <div className="d-flex gap-3">
                      <Form.Check
                        type="radio"
                        name="jenisTransaksiRadio" 
                        id="jenis-pemasukan"
                        value="pemasukan"
                        checked={jenis === 'pemasukan'}
                        onChange={(e) => setJenis(e.target.value as any)}
                        disabled={loading}
                        required 
                        label={ 
                          <span className="d-flex align-items-center fw-500">
                            <TrendingUp size={16} className="me-1" style={{ color: 'var(--sipdana-accent-green-base)'}} /> Pemasukan
                          </span>
                        }
                         className="radio-custom"
                      />
                      <Form.Check
                        type="radio"
                        name="jenisTransaksiRadio" 
                        id="jenis-pengeluaran"
                        value="pengeluaran"
                        checked={jenis === 'pengeluaran'}
                        onChange={(e) => setJenis(e.target.value as any)}
                        disabled={loading}
                        required 
                        label={ 
                           <span className="d-flex align-items-center fw-500">
                            <TrendingDown size={16} className="me-1" style={{ color: 'var(--sipdana-accent-red-base)'}} /> Pengeluaran
                          </span>
                        }
                         className="radio-custom"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold mb-2 d-flex align-items-center small text-muted">
                      <DollarSign size={16} className="me-2" style={{ color: 'var(--sipdana-primary)' }}/> Jumlah
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: 'var(--sipdana-gray-100)', borderColor: 'var(--sipdana-border-color)', borderRadius: '8px 0 0 8px' }}>Rp</span>
                      <Form.Control type="text" placeholder="0" value={formatDisplayJumlah(jumlah)} onChange={handleJumlahChange} disabled={loading} required inputMode="numeric" style={{ borderRadius: '0 8px 8px 0', borderColor: 'var(--sipdana-border-color)' }} />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold mb-2 d-flex align-items-center small text-muted">
                      <Tag size={16} className="me-2" style={{ color: 'var(--sipdana-primary)' }}/> Kategori
                    </Form.Label>
                    <Form.Select value={idKategori} onChange={(e) => setIdKategori(e.target.value)} disabled={loading || kategoriList.length === 0} required style={{ borderRadius: '8px', borderColor: 'var(--sipdana-border-color)' }} >
                      <option value="">-- Pilih --</option>
                      {kategoriList.map((kat) => (<option key={kat.id_kategori} value={kat.id_kategori}>{kat.nama_kategori}</option>))}
                    </Form.Select>
                    {kategoriList.length === 0 && !error && (<Form.Text className="text-muted small">Memuat...</Form.Text>)}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold mb-2 d-flex align-items-center small text-muted">
                      <MessageSquare size={16} className="me-2" style={{ color: 'var(--sipdana-primary)' }}/> Keterangan (Opsional)
                    </Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Contoh: Beli kopi..." value={keterangan} onChange={(e) => setKeterangan(e.target.value)} disabled={loading} style={{ borderRadius: '8px', borderColor: 'var(--sipdana-border-color)', fontSize: '0.9rem' }} />
                  </Form.Group>

                  <div className="d-grid gap-2 mt-4">
                    <Button type="submit" className="btn-sipdana-primary" disabled={loading} size="lg" style={{ borderRadius: '10px' }}>
                      {loading ? (<> <Spinner size="sm" className="me-2"/> Menyimpan... </>) : (<> <CheckCircle size={18} className="me-2 d-inline" /> Simpan Transaksi </>)}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showSuccessModal} onHide={handleCloseSuccess} centered className="status-modal">
         <Modal.Body className="text-center p-5"> <div style={{ backgroundColor: 'var(--sipdana-accent-green-bg-light)', color: 'var(--sipdana-accent-green-base)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', }}> <CheckCircleIcon size="40px" /> </div> <h3 className="fw-bold mb-3">Transaksi Berhasil! 🎉</h3> <p className="text-muted mb-4 fs-5"> Transaksi telah disimpan. </p> <Button className="btn-sipdana-primary w-100" size="lg" onClick={handleCloseSuccess} style={{ borderRadius: '10px' }}> Kembali Ke Beranda </Button> </Modal.Body>
      </Modal>
      <Modal show={showErrorModal} onHide={handleCloseError} centered className="status-modal">
         <Modal.Body className="text-center p-5"> <div style={{ backgroundColor: 'var(--sipdana-accent-red-bg-light)', color: 'var(--sipdana-accent-red-base)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', }}> <ErrorCircleIcon size="40px" /> </div> <h3 className="fw-bold mb-3">Transaksi Gagal</h3> <p className="text-muted mb-4 fs-5"> {modalErrorMessage || 'Terjadi kesalahan.'} </p> <div className="d-grid gap-2"> <Button className="btn-sipdana-primary w-100" size="lg" onClick={handleCloseError} style={{ borderRadius: '10px' }}> Coba Lagi </Button> <Button variant="outline-secondary" size="lg" onClick={() => navigate('/dashboard')} style={{ borderRadius: '10px' }}> Kembali Ke Beranda </Button> </div> </Modal.Body>
      </Modal>
    </div>
  );
};

const headerButtonStyle = `
.btn-header-icon { /* ... style tombol header ... */ }
.radio-custom { /* Styling radio button jika perlu */
   margin-bottom: 0; /* Hapus margin bawah default */
   padding-left: 2em; /* Beri ruang untuk label */
}
.radio-custom .form-check-input {
   margin-top: 0.2em; /* Sesuaikan posisi vertikal radio */
}
`;

try {
  const existingStyleSheet = document.getElementById("add-transaction-styles");
  if (!existingStyleSheet) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "add-transaction-styles";
    styleSheet.innerText = headerButtonStyle;
    document.head.appendChild(styleSheet);
  }
} catch (e) {
  console.error("Gagal inject style:", e);
}


export default AddTransactionPage;