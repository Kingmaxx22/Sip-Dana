import React from 'react';

// Komponen Ikon Dompet
export const WalletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="sipdana-logo-icon"
  >
    <path
      d="M21 4H7C5.34 4 4 5.34 4 7V17C4 18.66 5.34 20 7 20H21C22.66 20 24 18.66 24 17V7C24 5.34 22.66 4 21 4ZM21 17H7V11H21V17ZM21 8H7V7C7 6.45 7.45 6 8 6H20C20.55 6 21 6.45 21 7V8ZM2 7V21C2 22.1 2.9 23 4 23H19C19.55 23 20 22.55 20 22V21H4C3.45 21 3 20.55 3 20V7H2Z"
      fill="currentColor"
    />
  </svg>
);

// Komponen Ikon Panah Kembali
export const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="28px"
    height="28px"
    style={{ cursor: 'pointer' }}
  >
    <path d="M17.77 3.77L16 2L6 12L16 22L17.77 20.23L9.54 12L17.77 3.77Z" />
  </svg>
);