import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from '../pages/LoginPage';

beforeEach(() => { localStorage.clear(); vi.unstubAllGlobals(); });

it('submits credentials and navigates to the dashboard', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ token: 'token', user: { id: '1', name: 'Ada', email: 'ada@example.com', role: 'USER' } }) });
  vi.stubGlobal('fetch', fetchMock);
  render(<AuthProvider><MemoryRouter initialEntries={['/login']}><Routes><Route path="/login" element={<LoginPage />} /><Route path="/" element={<div>Dashboard</div>} /></Routes></MemoryRouter></AuthProvider>);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secure123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  await waitFor(() => expect(screen.getByText('Dashboard')).toBeInTheDocument());
  expect(fetchMock).toHaveBeenCalled();
});
