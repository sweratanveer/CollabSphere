// This file contains the HTTP service and signal-based state store for Task Management.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
} from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;

  tasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal('');

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tasks');
        this.loading.set(false);
      },
    });
  }

  updateStatus(id: string, status: TaskStatus): void {
    this.http.patch<Task>(`${this.apiUrl}/${id}/status`, { status }).subscribe({
      next: (updated) => {
        this.tasks.update((list) =>
          list.map((t) => (t.id === id ? { ...t, status: updated.status } : t)),
        );
      },
      error: () => {
        this.error.set('Failed to update task status');
      },
    });
  }

  deleteTask(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.tasks.update((list) => list.filter((t) => t.id !== id));
      },
      error: () => {
        this.error.set('Failed to delete task');
      },
    });
  }

  create(payload: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, payload);
  }

  findOne(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  update(id: string, payload: UpdateTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, payload);
  }
}