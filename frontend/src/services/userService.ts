import api from './api';

// Tipe data user
interface User {
  id_user: number;
  username: string;
  email: string;
}

// Tipe data input
interface UpdateProfileData {
  username: string;
  email: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Tipe data balikan API update profile
interface UpdateProfileResponse {
  message: string;
  user: User;
}

export const userService = {
  // Fungsi untuk memanggil PUT /api/users/profile
  updateProfile: (data: UpdateProfileData) => {
    // Token otomatis ditambahkan
    return api.put<UpdateProfileResponse>('/users/profile', data);
  },

  // Fungsi untuk memanggil PUT /api/users/password
  changePassword: (data: ChangePasswordData) => {
    return api.put('/users/password', data);
  },
};