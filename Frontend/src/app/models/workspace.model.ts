// This file defines the TypeScript interfaces and types for workspace data used across the app.
export type SubscriptionPlan = 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface WorkspaceCompany {
  id: string;
  companyName: string;
  companyCode: string;
  email: string;
}

export interface Workspace {
  id: string;
  workspaceName: string;
  slug: string;
  company: WorkspaceCompany;
  timezone: string;
  subscriptionPlan: SubscriptionPlan;
  maxUsers: number;
  isActive: boolean;
  settings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceRequest {
  workspaceName: string;
  companyId: string;
  slug?: string;
  timezone?: string;
  subscriptionPlan?: SubscriptionPlan;
  maxUsers?: number;
  isActive?: boolean;
}

export interface UpdateWorkspaceRequest {
  workspaceName?: string;
  slug?: string;
  timezone?: string;
  subscriptionPlan?: SubscriptionPlan;
  maxUsers?: number;
  isActive?: boolean;
}