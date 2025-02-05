export interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
}
