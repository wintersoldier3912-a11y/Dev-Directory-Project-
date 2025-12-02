export enum Role {
  FRONTEND = "Frontend",
  BACKEND = "Backend",
  FULLSTACK = "Full-Stack"
}

export interface Developer {
  id: string;
  name: string;
  role: Role;
  techStack: string[];
  experience: number;
}

export interface FilterState {
  search: string;
  role: string; // Empty string means "All"
  tech: string;
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