import api from './api';

// Interface TransaksiData
export interface TransaksiData {
  tanggal: string; 
  jenis: 'pemasukan' | 'pengeluaran' | '';
  jumlah: number;
  id_kategori: number; 
  keterangan?: string;
}

// Interface Transaksi
export interface Transaksi {
  id_transaksi: number;
  id_user: number;
  id_kategori: number;
  tanggal: string; 
  jumlah: number | string;
  jenis: 'pemasukan' | 'pengeluaran';
  keterangan: string | null;
  created_at: string;
  nama_kategori: string; 
}

export const transaksiService = {
  create: (data: TransaksiData) => {
    return api.post('/transaksi', data);
  },

  getFiltered: (startDate: string, endDate: string, limit?: number) => {
     let url = `/transaksi?startDate=${startDate}&endDate=${endDate}`;
     if (limit) {
         url += `&limit=${limit}`;
     }
     return api.get<Transaksi[]>(url);
  },
  
  getAll: (limit?: number) => {
     const url = limit ? `/transaksi?limit=${limit}` : '/transaksi';
     return api.get<Transaksi[]>(url);
  },

  update: (id: number, data: TransaksiData) => {
      return api.put(`/transaksi/${id}`, data);
  },

  delete: (id: number) => {
      return api.delete(`/transaksi/${id}`);
  }
};