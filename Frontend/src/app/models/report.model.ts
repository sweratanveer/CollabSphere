// This file defines the TypeScript interfaces for dashboard summary and report data shapes.
export interface DashboardSummary {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalUsers: number;
  totalTeams: number;
}

export interface TaskStatusCount {
  status: string;
  count: number;
}

export interface TaskPriorityCount {
  priority: string;
  count: number;
}

export interface ProjectProgress {
  projectId: string;
  projectName: string;
  status: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
}

export interface EmployeePerformance {
  userId: string;
  fullName: string;
  role: string;
  assignedTasks: number;
  completedTasks: number;
  completionRate: number;
}