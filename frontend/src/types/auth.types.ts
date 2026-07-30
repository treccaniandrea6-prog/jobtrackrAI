export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}