import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { AdminPage } from '../pages/AdminPage';

beforeEach(() => { localStorage.setItem('car-dealership-auth', JSON.stringify({ token: 'token', user: { id: '1', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' } })); vi.unstubAllGlobals(); });

it('opens an add form and submits a vehicle', async () => {
  const fetchMock = vi.fn().mockImplementation(async (_url: string, options: RequestInit) => ({ ok: true, status: options.method === 'POST' ? 201 : 200, json: async () => options.method === 'POST' ? { id: '1', make: 'Toyota', model: 'Camry', category: 'SEDAN', price: 10000, quantity: 2 } : { data: [], page: 1, limit: 100, total: 0 } }));
  vi.stubGlobal('fetch', fetchMock);
  render(<AuthProvider><MemoryRouter><AdminPage /></MemoryRouter></AuthProvider>);
  fireEvent.click(await screen.findByRole('button', { name: 'Add vehicle' }));
  fireEvent.change(screen.getByLabelText('Make'), { target: { value: 'Toyota' } });
  fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'Camry' } });
  fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'SEDAN' } });
  fireEvent.change(screen.getByLabelText('Price'), { target: { value: '10000' } });
  fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create vehicle' }));
  await waitFor(() => expect(fetchMock.mock.calls.some(([, options]) => options.method === 'POST')).toBe(true));
});
