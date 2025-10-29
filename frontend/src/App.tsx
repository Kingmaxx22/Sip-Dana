import { Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './layouts/ProtectedRoute';
import AddTransactionPage from './pages/AddTransactionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MetodeMengelolaPage from './pages/MetodeMengelolaPage';
import TargetMenabungPage from './pages/TargetMenabungPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<StartPage />} />

      {/* Rute untuk Autentikasi (Login & Register) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rute Terproteksi (Hanya bisa diakses setelah login) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tambah-transaksi" element={<AddTransactionPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/metode-mengelola" element={<MetodeMengelolaPage />} />
        <Route path="/target-menabung" element={<TargetMenabungPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

    </Routes>
  );
}

export default App;