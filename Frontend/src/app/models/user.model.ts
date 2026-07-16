// This file defines the TypeScript interfaces for user data used across the app.
import { CompanyOption } from './workspace.model';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'COMPANY_ADMIN'
  | 'PROJECT_MANAGER'
  | 'TEAM_LEADER'
  | 'EMPLOYEE'
  | 'CLIENT';

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  company?: CompanyOption | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  companyId?: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  fullName?: string;
  role?: UserRole;
  companyId?: string;
  isActive?: boolean;
}