// This file contains the HTTP service and signal-based state store for Workspace Management.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  CompanyOption,
} from '../models/workspace.model';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/workspaces`;
  private companiesUrl = `${environment.apiUrl}/companies`;

  // Signal-based state, read directly by components — no manual subscriptions needed.
  workspaces = signal<Workspace[]>([]);
  loading = signal(false);
  error = signal('');

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<Workspace[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.workspaces.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load workspaces');
        this.loading.set(false);
      },
    });
  }

  toggleStatus(id: string): void {
    this.http.patch<Workspace>(`${this.apiUrl}/${id}/status`, {}).subscribe({
      next: (updated) => {
        this.workspaces.update((list) =>
          list.map((w) => (w.id === id ? { ...w, isActive: updated.isActive } : w)),
        );
      },
      error: () => {
        this.error.set('Failed to update workspace status');
      },
    });
  }

  deleteWorkspace(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.workspaces.update((list) => list.filter((w) => w.id !== id));
      },
      error: () => {
        this.error.set('Failed to delete workspace');
      },
    });
  }

  // Direct observable calls for pages that need one-off requests (create/edit/details).
  create(payload: CreateWorkspaceRequest): Observable<Workspace> {
    return this.http.post<Workspace>(this.apiUrl, payload);
  }

  findOne(id: string): Observable<Workspace> {
    return this.http.get<Workspace>(`${this.apiUrl}/${id}`);
  }

 findByCompany(companyId: string): Observable<Workspace[]> {
  return this.http.get<Workspace[]>(`${this.apiUrl}/company/${companyId}`);
}
  update(id: string, payload: UpdateWorkspaceRequest): Observable<Workspace> {
    return this.http.patch<Workspace>(`${this.apiUrl}/${id}`, payload);
  }

  getCompanies(): Observable<CompanyOption[]> {
    return this.http.get<CompanyOption[]>(this.companiesUrl);
  }
}