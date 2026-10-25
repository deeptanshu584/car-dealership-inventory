import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { DashboardPage } from '../pages/DashboardPage';

beforeEach(() => {
  localStorage.setItem('car-dealership-auth', JSON.stringify({ token: 'token', user: { id: '1', name: 'Ada', email: 'ada@example.com', role: 'USER' } }));
  vi.unstubAllGlobals();
});

it('shows vehicle cards and disables purchase when stock is zero', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ data: [{ id: 'car-1', make: 'Toyota', model: 'Camry', category: 'SEDAN', price: 15000, quantity: 0, createdAt: '', updatedAt: '' }], page: 1, limit: 12, total: 1 }) }));
  render(<AuthProvider><MemoryRouter><DashboardPage /></MemoryRouter></AuthProvider>);
  await waitFor(() => expect(screen.getByText('Toyota Camry')).toBeInTheDocument());
  expect(screen.getByRole('button', { name: 'Purchase Toyota Camry' })).toBeDisabled();
});
