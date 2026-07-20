// This file defines the TypeScript interfaces for the Super Admin system-wide dashboard data.
export interface SystemOverview {
  totalCompanies: number;
  activeCompanies: number;
  totalWorkspaces: number;
  activeWorkspaces: number;
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalTasks: number;
  activeSubscriptions: number;
}

export interface RecentCompany {
  id: string;
  companyName: string;
  companyCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface UsersByRole {
  role: string;
  count: number;
}

export interface CompanyGrowthPoint {
  month: string;
  count: number;
}