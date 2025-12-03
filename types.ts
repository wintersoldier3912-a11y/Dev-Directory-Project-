export enum Role {
  FRONTEND = "Frontend",
  BACKEND = "Backend",
  FULLSTACK = "Full-Stack"
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Developer {
  id: string;
  name: string;
  role: Role;
  techStack: string[];
  experience: number;
  about?: string;
  joiningDate?: string;
  createdBy?: string; // User ID
  createdAt?: string;
}

export interface FilterState {
  search: string;
  role: string;
  tech: string;
  sort: 'experience_asc' | 'experience_desc' | 'newest';
  page: number;
}

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export const ROLES = [Role.FRONTEND, Role.BACKEND, Role.FULLSTACK];