// This file contains the HTTP service and signal-based state store for Project Management.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  projects = signal<Project[]>([]);
  loading = signal(false);
  error = signal('');

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<Project[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load projects');
        this.loading.set(false);
      },
    });
  }

  toggleStatus(id: string): void {
    this.http.patch<Project>(`${this.apiUrl}/${id}/status`, {}).subscribe({
      next: (updated) => {
        this.projects.update((list) =>
          list.map((p) => (p.id === id ? { ...p, isActive: updated.isActive } : p)),
        );
      },
      error: () => {
        this.error.set('Failed to update project status');
      },
    });
  }

  deleteProject(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.projects.update((list) => list.filter((p) => p.id !== id));
      },
      error: () => {
        this.error.set('Failed to delete project');
      },
    });
  }

  create(payload: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, payload);
  }

  findOne(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  update(id: string, payload: UpdateProjectRequest): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/${id}`, payload);
  }
}