import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/pages/Login';
import { AuthProvider } from '../../src/context/AuthContext';
import { ThemeProvider } from '../../src/context/ThemeContext';

// Mock Lucide icons to avoid issues in testing environment
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual as any,
    LogIn: () => <div data-testid="login-icon" />,
    Mail: () => <div data-testid="mail-icon" />,
    Lock: () => <div data-testid="lock-icon" />,
  };
});

describe('Login Page', () => {
  it('renders login form items', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Initialize Session/i })).toBeInTheDocument();
  });
});
