export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
