import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../src/pages/Dashboard';
import { AuthProvider } from '../../src/context/AuthContext';
import { ThemeProvider } from '../../src/context/ThemeContext';
import api from '../../src/services/api';

// Mock the API service
vi.mock('../../src/services/api');

const mockTasks = [
  { id: 1, title: 'Test Task 1', description: 'Description 1', status: 'pending', userId: 1, createdAt: new Date().toISOString() },
  { id: 2, title: 'Test Task 2', description: 'Description 2', status: 'completed', userId: 1, createdAt: new Date().toISOString() },
];

describe('Dashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderDashboard = () => {
    return render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <Dashboard />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  it('fetches and displays tasks on mount', async () => {
    (api.get as any).mockResolvedValue({ data: mockTasks });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('/tasks');
  });

  it('shows error message when API fails', async () => {
    (api.get as any).mockRejectedValue({ 
      response: { data: { error: 'Failed to fetch tasks' } } 
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Synchronization Error/i)).toBeInTheDocument();
    });
  });
});
