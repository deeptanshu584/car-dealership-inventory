import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { DashboardPage } from '../pages/DashboardPage';

beforeEach(() => {
  localStorage.setItem(
    'car-dealership-auth',
    JSON.stringify({
      token: 'token',
      user: { id: '1', name: 'Ada', email: 'ada@example.com', role: 'USER' },
    }),
  );
  vi.unstubAllGlobals();
});

it('searches after entering a make filter', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ data: [], page: 1, limit: 12, total: 0 }),
  });
  vi.stubGlobal('fetch', fetchMock);
  render(
    <AuthProvider>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </AuthProvider>,
  );
  fireEvent.change(screen.getByLabelText('Make'), {
    target: { value: 'Toyota' },
  });
  await waitFor(
    () =>
      expect(
        fetchMock.mock.calls.some(([url]) =>
          String(url).includes('/vehicles/search?make=Toyota'),
        ),
      ).toBe(true),
    { timeout: 1500 },
  );
});
