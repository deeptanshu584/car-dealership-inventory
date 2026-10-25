import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { App } from '../App';

beforeEach(() => localStorage.clear());

it('shows the login route', () => {
  render(<AuthProvider><MemoryRouter initialEntries={['/login']}><App /></MemoryRouter></AuthProvider>);
  expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
});
