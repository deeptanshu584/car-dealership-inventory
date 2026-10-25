import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';

function Probe() {
  const { user, logout } = useAuth();
  return (
    <>
      <span>{user?.name ?? 'anonymous'}</span>
      <button onClick={logout}>Log out</button>
    </>
  );
}

beforeEach(() => localStorage.clear());

it('restores a saved session and clears it on logout', () => {
  localStorage.setItem(
    'car-dealership-auth',
    JSON.stringify({
      token: 'token',
      user: { id: '1', name: 'Ada', email: 'ada@example.com', role: 'USER' },
    }),
  );
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
  expect(screen.getByText('Ada')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Log out' }));
  expect(screen.getByText('anonymous')).toBeInTheDocument();
  expect(localStorage.getItem('car-dealership-auth')).toBeNull();
});
