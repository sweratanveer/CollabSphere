// This file contains the HTTP service and signal-based state store for dashboard reports and analytics.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import {
  DashboardSummary,
  TaskStatusCount,
  TaskPriorityCount,
  ProjectProgress,
  EmployeePerformance,
} from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reports`;

  summary = signal<DashboardSummary | null>(null);
  tasksByStatus = signal<TaskStatusCount[]>([]);
  tasksByPriority = signal<TaskPriorityCount[]>([]);
  projectProgress = signal<ProjectProgress[]>([]);
  employeePerformance = signal<EmployeePerformance[]>([]);

  loading = signal(false);
  error = signal('');

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<DashboardSummary>(`${this.apiUrl}/summary`).subscribe({
      next: (data) => this.summary.set(data),
      error: () => this.error.set('Failed to load dashboard summary'),
    });

    this.http.get<TaskStatusCount[]>(`${this.apiUrl}/tasks-by-status`).subscribe({
      next: (data) => this.tasksByStatus.set(data),
      error: () => this.error.set('Failed to load task status breakdown'),
    });

    this.http.get<TaskPriorityCount[]>(`${this.apiUrl}/tasks-by-priority`).subscribe({
      next: (data) => this.tasksByPriority.set(data),
      error: () => this.error.set('Failed to load task priority breakdown'),
    });

    this.http.get<ProjectProgress[]>(`${this.apiUrl}/project-progress`).subscribe({
      next: (data) => this.projectProgress.set(data),
      error: () => this.error.set('Failed to load project progress'),
    });

    this.http.get<EmployeePerformance[]>(`${this.apiUrl}/employee-performance`).subscribe({
      next: (data) => {
        this.employeePerformance.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load employee performance');
        this.loading.set(false);
      },
    });
  }
}