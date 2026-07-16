// This file defines the TypeScript interfaces for project data used across the app.
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface ProjectWorkspace {
  id: string;
  workspaceName: string;
}

export interface ProjectManagerOption {
  id: string;
  fullName: string;
}

export interface Project {
  id: string;
  projectName: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  workspace: ProjectWorkspace;
  projectManager?: ProjectManagerOption | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  projectName: string;
  description?: string;
  workspaceId: string;
  projectManagerId?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectRequest {
  projectName?: string;
  description?: string;
  projectManagerId?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface ProjectOption {
  id: string;
  projectName: string;
}