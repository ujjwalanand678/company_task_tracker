export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface TaskAssignment {
  id: number;
  userId: number;
  taskId: number;
  status: 'pending' | 'completed';
  user?: {
    email: string;
    name: string;
  };
}

export interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  assignments: TaskAssignment[];
  creator?: {
    name: string;
  };
  // For standard user view compatibility
  status?: 'pending' | 'completed'; 
  assignmentId?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
