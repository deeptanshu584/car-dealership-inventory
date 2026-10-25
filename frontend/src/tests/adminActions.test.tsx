import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { AdminPage } from '../pages/AdminPage';

const car = {
  id: 'car-1',
  make: 'Honda',
  model: 'Civic',
  category: 'SEDAN',
  price: 10000,
  quantity: 1,
  createdAt: '',
  updatedAt: '',
};
beforeEach(() => {
  localStorage.setItem(
    'car-dealership-auth',
    JSON.stringify({
      token: 'token',
      user: {
        id: '1',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
    }),
  );
  vi.unstubAllGlobals();
});
function mount(fetchMock: ReturnType<typeof vi.fn>) {
  vi.stubGlobal('fetch', fetchMock);
  render(
    <AuthProvider>
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    </AuthProvider>,
  );
}

it('prefills the edit modal and sends an update', async () => {
  const fetchMock = vi
    .fn()
    .mockImplementation(async (_url: string, options: RequestInit) => ({
      ok: true,
      status: 200,
      json: async () =>
        options.method === 'PUT'
          ? { ...car, model: 'Accord' }
          : { data: [car], page: 1, limit: 100, total: 1 },
    }));
  mount(fetchMock);
  fireEvent.click(await screen.findByRole('button', { name: 'Edit' }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByLabelText('Make')).toHaveValue('Honda');
  fireEvent.change(within(dialog).getByLabelText('Model'), {
    target: { value: 'Accord' },
  });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Save changes' }));
  await waitFor(() =>
    expect(
      fetchMock.mock.calls.some(([, options]) => options.method === 'PUT'),
    ).toBe(true),
  );
});

it('confirms deletion before sending DELETE', async () => {
  const fetchMock = vi
    .fn()
    .mockImplementation(async (_url: string, options: RequestInit) =>
      options.method === 'DELETE'
        ? { ok: true, status: 204, json: async () => ({}) }
        : {
            ok: true,
            status: 200,
            json: async () => ({ data: [car], page: 1, limit: 100, total: 1 }),
          },
    );
  mount(fetchMock);
  fireEvent.click(await screen.findByRole('button', { name: 'Delete' }));
  expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Confirm delete' }));
  await waitFor(() =>
    expect(
      fetchMock.mock.calls.some(([, options]) => options.method === 'DELETE'),
    ).toBe(true),
  );
});

it('restocks a vehicle through the API', async () => {
  const fetchMock = vi
    .fn()
    .mockImplementation(async (_url: string, options: RequestInit) => ({
      ok: true,
      status: 200,
      json: async () =>
        options.method === 'POST'
          ? { ...car, quantity: 3 }
          : { data: [car], page: 1, limit: 100, total: 1 },
    }));
  mount(fetchMock);
  fireEvent.change(await screen.findByLabelText('Restock quantity'), {
    target: { value: '2' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Restock' }));
  await waitFor(() =>
    expect(screen.getByText(/3 in stock/)).toBeInTheDocument(),
  );
});
