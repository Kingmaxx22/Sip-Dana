import api from './api';

// Tipe data untuk balikan dari API
export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

export const kategoriService = {
  // Fungsi untuk memanggil API GET /api/kategori
  getAll: () => {
    return api.get<Kategori[]>('/kategori');
  },
};