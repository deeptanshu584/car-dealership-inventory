export type Role = 'USER' | 'ADMIN';
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
export interface Page<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
