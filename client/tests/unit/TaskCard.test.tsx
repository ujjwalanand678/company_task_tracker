import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskCard from '../../src/components/TaskCard';
import { Task } from '../../src/types';

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  userId: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TaskCard Component', () => {
  it('renders task title and description', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders status badge correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    expect(screen.getByText('pending')).toBeInTheDocument();
  });
});
