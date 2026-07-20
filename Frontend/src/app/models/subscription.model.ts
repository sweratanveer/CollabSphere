// This file defines the TypeScript interfaces for subscription plans and company subscriptions.
export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  maxUsers: number;
  maxWorkspaces: number;
  features?: string[];
  isActive: boolean;
}

export interface SubscriptionCompanyRef {
  id: string;
  companyName: string;
}

export interface CompanySubscription {
  id: string;
  company: SubscriptionCompanyRef;
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate?: string;
}

export interface CreatePlanRequest {
  name: string;
  monthlyPrice: number;
  maxUsers: number;
  maxWorkspaces: number;
  features?: string[];
  isActive?: boolean;
}