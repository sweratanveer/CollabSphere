// This file defines the TypeScript interfaces for task data used across the app.
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskProject {
  id: string;
  projectName: string;
}

export interface TaskAssignee {
  id: string;
  fullName: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  project: TaskProject;
  assignedTo?: TaskAssignee | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId: string;
  assignedToId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignedToId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}