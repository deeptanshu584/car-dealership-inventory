import { Link, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
    <Route path="*" element={<main className="flex min-h-screen flex-col items-center justify-center bg-mist p-8 text-center"><p className="text-7xl font-black text-teal">404</p><h1 className="mt-3 text-2xl font-bold text-ink">Page not found</h1><Link to="/" className="mt-6 rounded-xl bg-teal px-5 py-3 font-semibold text-white">Back to inventory</Link></main>} />
  </Routes>;
}
