import React from 'react';

interface IconProps {
  className?: string;
  size?: string;
}

// Ikon Panah Kiri (untuk navigasi bulan/minggu)
export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20px"
    height="20px"
    className={className}
    style={{ cursor: 'pointer' }}
  >
    <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />
  </svg>
);

// Ikon Panah Kanan
export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20px"
    height="20px"
    className={className}
    style={{ cursor: 'pointer' }}
  >
    <path d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z" />
  </svg>
);

// Ikon Mata Terbuka (untuk melihat jumlah)
export const EyeOpenIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24px"
    height="24px"
    className={className}
  >
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" />
  </svg>
);

// Ikon Mata Tertutup (untuk menyembunyikan jumlah)
export const EyeClosedIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24px"
    height="24px"
    className={className}
  >
    <path d="M12 7C14.76 7 17 9.24 17 12C17 12.35 16.96 12.69 16.9 13.01L19.26 15.37C21.07 13.88 22.42 12.02 23 12C21.27 7.61 17 4.5 12 4.5C10.74 4.5 9.53 4.74 8.39 5.16L10.15 6.92C10.74 6.64 11.37 6.5 12 6.5C9.24 6.5 7 8.74 7 11.5C7 12.13 7.14 12.76 7.42 13.35L1 18.59L2.41 20L5.73 16.68L7.33 18.28C8.38 18.84 9.61 19.22 12 19.22C17 19.22 21.27 16.39 23 12C22.61 11.08 22.06 10.22 21.39 9.47L17.77 5.85L16.36 4.44L12.74 8.06L11.33 6.65L12 7ZM14.97 12.01L12 9.04L9.03 12.01L12 14.97L14.97 12.01Z" />
  </svg>
);

// Ikon Rumah (Home)
export const HouseIcon: React.FC<IconProps> = ({ size = '24px' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" />
  </svg>
);

// Ikon Grafik (Analytics)
export const GraphIcon: React.FC<IconProps> = ({ size = '24px' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M16 11V3H18V11H16ZM12 18V3H14V18H12ZM8 21V3H10V21H8ZM4 15V3H6V15H4Z" />
  </svg>
);

// Ikon Dompet (Wallet)
export const WalletIcon: React.FC<IconProps> = ({ size = '24px' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M21 4H7C5.34 4 4 5.34 4 7V17C4 18.66 5.34 20 7 20H21C22.66 20 24 18.66 24 17V7C24 5.34 22.66 4 21 4ZM21 17H7V11H21V17ZM21 8H7V7C7 6.45 7.45 6 8 6H20C20.55 6 21 6.45 21 7V8ZM2 7V21C2 22.1 2.9 23 4 23H19C19.55 23 20 22.55 20 22V21H4C3.45 21 3 20.55 3 20V7H2Z" />
  </svg>
);

// Ikon Folder (Records)
export const FolderIcon: React.FC<IconProps> = ({ size = '24px' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" />
  </svg>
);

// Ikon User (Profile)
export const UserIcon: React.FC<IconProps> = ({ size = '24px' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M12 4C14.21 4 16 5.79 16 8C16 10.21 14.21 12 12 12C9.79 12 8 10.21 8 8C8 5.79 9.79 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z" />
  </svg>
);

// Ikon Pensil (untuk tombol tambah transaksi)
export const PenIcon: React.FC<IconProps> = ({ className, size = '24px' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="white" 
    width={size}
    height={size}
    className={className}
  >
    <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" />
  </svg>
);

// Ikon Menu (untuk toggle sidebar)
export const MenuIcon: React.FC<IconProps> = ({ size = '28px', className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    style={{ cursor: 'pointer' }}
  >
    <path d="M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z" />
  </svg>
);

// Ikon Close (X)
export const CloseIcon: React.FC<IconProps> = ({ size = '28px', className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    style={{ cursor: 'pointer' }}
  >
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
  </svg>
);

// Ikon Ceklis (Sukses)
export const CheckCircleIcon: React.FC<IconProps> = ({ size = '24px', className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
  </svg>
);

// Ikon Error/Silang (Gagal)
export const ErrorCircleIcon: React.FC<IconProps> = ({ size = '24px', className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
  </svg>
);

// Ikon Piggy Bank (Tabungan)
export const SavingsIcon: React.FC<IconProps> = ({ size = '24px', className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width={size} 
    height={size} 
    className={className}
  >
    <path d="M17 5.3C15.3 4.5 13.5 4 12 4C8.4 4 5.2 5.9 3.4 8.6C3.1 9 3.4 9.6 3.9 9.6H6.5C7 9.6 7.4 9.2 7.5 8.7C8 7.2 9.7 6 12 6C13.8 6 15.4 6.8 16.5 8.1L15.3 9.3C14.9 9.7 15.2 10.3 15.7 10.3H20.1C20.6 10.3 21 9.9 21 9.4V5C21 4.5 20.4 4.1 20 4.5L17 7.5V5.3ZM12 11C10.9 11 10 11.9 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11.9 13.1 11 12 11ZM21 12C20.4 12 20 12.4 20 13C20 15.2 18.2 17 16 17H8C5.8 17 4 15.2 4 13C4 12.4 3.6 12 3 12C2.4 12 2 12.4 2 13C2 16.3 4.7 19 8 19H16C19.3 19 22 16.3 22 13C22 12.4 21.6 12 21 12Z" />
  </svg>
);

// Ikon Panah Naik (Pemasukan)
export const ArrowUpIcon: React.FC<IconProps> = ({ size = '24px', className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width={size} 
    height={size} 
    className={className}
  >
    <path d="M4 12L5.4 13.4L11 7.8V20H13V7.8L18.6 13.4L20 12L12 4L4 12Z" />
  </svg>
);

// Ikon Panah Turun (Pengeluaran)
export const ArrowDownIcon: React.FC<IconProps> = ({ size = '24px', className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width={size} 
    height={size} 
    className={className}
  >
    <path d="M20 12L18.6 10.6L13 16.2V4H11V16.2L5.4 10.6L4 12L12 20L20 12Z" />
  </svg>
);

// Ikon Edit (Pensil)
export const EditIcon: React.FC<IconProps> = ({ size = '24px', className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor" 
    width={size}
    height={size}
    className={className}
  >
    <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" />
  </svg>
);

// Ikon Gembok (Password)
export const LockIcon: React.FC<IconProps> = ({ size = '24px', className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width={size} 
    height={size} 
    className={className}
  >
    <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 2c1.66 0 3 1.34 3 3v2H9V5c0-1.66 1.34-3 3-3zm6 18H6V10h12v10z"/>
  </svg>
);

// Ikon Pengaturan (Settings)
export const SettingsIcon: React.FC<IconProps> = ({ size = '24px', className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width={size} 
    height={size} 
    className={className}
  >
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
  </svg>
);