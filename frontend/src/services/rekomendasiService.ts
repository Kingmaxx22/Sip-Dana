import api from './api';

interface Metode { namaMetode: string; deskripsiMetode: string; }

export interface SpendingHabitRec {
  rekomendasi: string;
  metode: Metode | null;
  tanggal_dibuat?: string; 
}

export interface WeeklySavingsRec {
  totalPemasukan: number | null | string; 
  totalPengeluaran: number | null | string;
  saldoMingguan: number | null | string;
  rekomendasiTeks: string;
  targetMenabung: number | null;
  tanggal_dibuat?: string; 
}

export const rekomendasiService = {
  getLatestSpendingHabit: () => {
    return api.get<SpendingHabitRec>('/rekomendasi/latest/habits');
  },

  getLatestWeeklySavings: () => {
    return api.get<WeeklySavingsRec>('/rekomendasi/latest/savings');
  },
  
   generateNewSpendingHabit: () => {
       return api.get<SpendingHabitRec>('/rekomendasi/generate/habits');
   },
   generateNewWeeklySavings: () => {
       return api.get<WeeklySavingsRec>('/rekomendasi/generate/savings');
   }
};