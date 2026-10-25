import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { DashboardPage } from '../pages/DashboardPage';

beforeEach(() => { localStorage.setItem('car-dealership-auth', JSON.stringify({ token: 'token', user: { id: '1', name: 'Ada', email: 'ada@example.com', role: 'USER' } })); vi.unstubAllGlobals(); });

it('purchases a car and updates its stock in place', async () => {
  const car = { id: 'car-1', make: 'Toyota', model: 'Camry', category: 'SEDAN', price: 15000, quantity: 1, createdAt: '', updatedAt: '' };
  const fetchMock = vi.fn().mockImplementation(async (_url: string, options: RequestInit) => ({ ok: true, status: 200, json: async () => options.method === 'POST' ? { ...car, quantity: 0 } : { data: [car], page: 1, limit: 12, total: 1 } }));
  vi.stubGlobal('fetch', fetchMock);
  render(<AuthProvider><MemoryRouter><DashboardPage /></MemoryRouter></AuthProvider>);
  fireEvent.click(await screen.findByRole('button', { name: 'Purchase Toyota Camry' }));
  await waitFor(() => expect(screen.getByText('Out of stock')).toBeInTheDocument());
  expect(screen.getByRole('status')).toHaveTextContent('Purchase successful');
});
