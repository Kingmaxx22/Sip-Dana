import api from './api';

// Tipe data untuk input register
interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Tipe data balikan dari API
interface AuthResponse {
  message: string;
  token: string;
  user: {
    id_user: number;
    username: string;
    email: string;
  };
}

export const authService = {
  // Fungsi untuk memanggil API register
  register: (data: RegisterData) => {
    return api.post<AuthResponse>('/auth/register', data);
  },

  // Fungsi untuk memanggil API login
  login: (data: LoginData) => {
    return api.post<AuthResponse>('/auth/login', data);
  },
};