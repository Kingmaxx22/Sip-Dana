import api from './api';

export interface LaporanHarian {
  id_laporan: number;
  id_user: number;
  jenisLaporan: 'Harian'; 
  totalPemasukan: number | string; 
  totalPengeluaran: number | string;
  saldoAkhir: number | string;
  tanggal_laporan: string; 
}


export const laporanService = {
  getLaporan: (startDate: string, endDate: string, type: 'Harian' | 'Bulanan' | 'Tahunan' = 'Harian') => {
    return api.get<LaporanHarian[]>(`/laporan?startDate=${startDate}&endDate=${endDate}&type=${type}`);
  },

   getLaporanHarian: (tanggal: string) => {
     return api.get<LaporanHarian[]>(`/laporan?startDate=${tanggal}&endDate=${tanggal}&type=Harian`);
   }
};