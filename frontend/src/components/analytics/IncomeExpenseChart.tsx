import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Keep Filler if using fill: true
} from 'chart.js';
// Pastikan path service benar
import { type Transaksi } from '../../services/transaksiService';

// Daftarkan komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Keep Filler if needed
);

interface ChartProps {
  transactions: Transaksi[];
}

// Helper format IDR (atau impor dari utils)
const formatIDR = (value: number | undefined | null | string) => {
   const numValue = Number(value) || 0;
   return new Intl.NumberFormat('id-ID', {
     style: 'currency',
     currency: 'IDR',
     minimumFractionDigits: 0,
     maximumFractionDigits: 0,
   }).format(numValue);
};

const IncomeExpenseChart: React.FC<ChartProps> = ({ transactions }) => {

  const processData = () => {
    const dailyData: Record<string, { income: number; expense: number; originalDate: Date }> = {};

    transactions.forEach(trx => {
      // Pastikan tanggal valid dan buat key YYYY-MM-DD
      const originalDate = new Date(trx.tanggal + 'T00:00:00'); // Interpretasi lokal
      if (isNaN(originalDate.getTime())) {
          console.warn(`Invalid date skipped in chart data: ${trx.tanggal}`);
          return;
      }
      const dateKey = originalDate.toISOString().split('T')[0];

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { income: 0, expense: 0, originalDate: originalDate };
      }

      // --- PERBAIKAN DI SINI: Konversi jumlah ke Angka ---
      const amount = Number(trx.jumlah) || 0;
      // --------------------------------------------------

      if (trx.jenis === 'pemasukan') {
        dailyData[dateKey].income += amount; // Gunakan amount
      } else {
        dailyData[dateKey].expense += amount; // Gunakan amount
      }
    });

    // Urutkan berdasarkan tanggal asli
    const sortedDates = Object.keys(dailyData).sort((a, b) => dailyData[a].originalDate.getTime() - dailyData[b].originalDate.getTime());

    const labels: string[] = [];
    const incomeData: number[] = [];
    const expenseData: number[] = [];

    // Ambil data dari object yang sudah diurutkan
    sortedDates.forEach(dateKey => {
        // Format tanggal untuk label X-Axis
        labels.push(dailyData[dateKey].originalDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }));
        incomeData.push(dailyData[dateKey].income);
        expenseData.push(dailyData[dateKey].expense);
    });

    return { labels, incomeData, expenseData };
  };

  const { labels, incomeData, expenseData } = processData();

  // Konfigurasi data untuk Chart.js
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: incomeData,
        borderColor: 'var(--sipdana-accent-green-base)', // Gunakan variabel
        backgroundColor: 'rgba(25, 135, 84, 0.2)', // Warna area hijau transparan
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'var(--sipdana-accent-green-base)', // Warna titik
        pointBorderColor: 'var(--sipdana-white)',
        pointHoverBackgroundColor: 'var(--sipdana-white)',
        pointHoverBorderColor: 'var(--sipdana-accent-green-base)',

      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        borderColor: 'var(--sipdana-accent-red-base)', // Gunakan variabel
        backgroundColor: 'rgba(220, 53, 69, 0.2)', // Warna area merah transparan
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'var(--sipdana-accent-red-base)',
        pointBorderColor: 'var(--sipdana-white)',
        pointHoverBackgroundColor: 'var(--sipdana-white)',
        pointHoverBorderColor: 'var(--sipdana-accent-red-base)',
      },
    ],
  };

  // Opsi Tampilan Chart
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Penting agar tinggi container bisa mengontrol
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
            usePointStyle: true, // Gunakan gaya titik di legenda
            padding: 20, // Jarak legenda
            color: 'var(--sipdana-gray-700)', // Warna teks legenda
        }
      },
      title: {
        display: true,
        text: 'Grafik Pemasukan vs Pengeluaran Harian', // Judul lebih jelas
        color: 'var(--sipdana-gray-900)', // Warna judul
        font: {
            size: 16, // Ukuran font judul
            weight: 'bold' as const,
        },
        padding: {
            top: 10,
            bottom: 20 // Jarak bawah judul
        }
      },
      tooltip: {
        enabled: true, // Pastikan tooltip aktif
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Background tooltip
        titleColor: 'var(--sipdana-white)',
        bodyColor: 'var(--sipdana-white)',
        borderColor: 'var(--sipdana-border-color)',
        borderWidth: 1,
        padding: 10, // Padding tooltip
        displayColors: true, // Tampilkan kotak warna
        boxPadding: 4,
        callbacks: {
            // Format angka di tooltip
            label: function(context: any) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += formatIDR(context.parsed.y); // Gunakan helper format
                }
                return label;
            }
        }
      },
    },
    scales: { // Pengaturan sumbu
        x: {
            grid: {
                display: false // Sembunyikan grid vertikal
            },
            ticks: {
                 color: 'var(--sipdana-gray-600)', // Warna label sumbu X
                 font: { size: 10 }
            }
        },
        y: {
            grid: {
                color: 'var(--sipdana-border-color)' // Warna grid horizontal
            },
            ticks: {
                 color: 'var(--sipdana-gray-600)', // Warna label sumbu Y
                 font: { size: 10 },
                 // Format angka di sumbu Y
                 callback: function(value: any) {
                    return formatIDR(value); // Gunakan helper format
                 }
            },
             beginAtZero: true // Mulai sumbu Y dari 0
        }
    }
  };

  return (
    // Pastikan container punya tinggi
    <div style={{ position: 'relative', height: '350px', width: '100%' }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default IncomeExpenseChart;