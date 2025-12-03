import { Developer, FilterState, Role, AuthResponse } from '../types';

const API_URL = 'http://localhost:3001';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export interface PaginatedResponse {
  data: Developer[];
  total: number;
  page: number;
  totalPages: number;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
};

export const fetchDevelopers = async (filters: FilterState): Promise<PaginatedResponse> => {
  const params = new URLSearchParams();
  if (filters.role) params.append('role', filters.role);
  if (filters.tech) params.append('tech', filters.tech);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);
  params.append('page', filters.page.toString());
  params.append('limit', '9');

  const response = await fetch(`${API_URL}/developers?${params.toString()}`, {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    if (response.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to fetch developers');
  }
  
  return response.json();
};

export const fetchDeveloperById = async (id: string): Promise<Developer> => {
  const response = await fetch(`${API_URL}/developers/${id}`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Developer not found');
  return response.json();
};

export const createDeveloper = async (developer: Omit<Developer, 'id'>): Promise<Developer> => {
  const response = await fetch(`${API_URL}/developers`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(developer),
  });

  if (!response.ok) throw new Error('Failed to create developer');
  return response.json();
};

export const updateDeveloper = async (id: string, developer: Partial<Developer>): Promise<Developer> => {
  const response = await fetch(`${API_URL}/developers/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(developer),
  });

  if (!response.ok) throw new Error('Failed to update developer');
  return response.json();
};

export const deleteDeveloper = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/developers/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to delete developer');
};