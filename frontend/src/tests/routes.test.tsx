import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, it } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminRoute } from '../components/AdminRoute';

beforeEach(() => localStorage.clear());

it('redirects anonymous visitors from protected pages', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login screen</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
  expect(screen.getByText('Login screen')).toBeInTheDocument();
});

it('blocks normal users from the admin page', () => {
  localStorage.setItem(
    'car-dealership-auth',
    JSON.stringify({
      token: 'token',
      user: { id: '1', name: 'Ada', email: 'ada@example.com', role: 'USER' },
    }),
  );
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin screen</div>
              </AdminRoute>
            }
          />
          <Route path="/" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
