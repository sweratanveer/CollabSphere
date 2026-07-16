// This file contains the HTTP service and signal-based state store for User Management.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AppUser, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  users = signal<AppUser[]>([]);
  loading = signal(false);
  error = signal('');

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<AppUser[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load users');
        this.loading.set(false);
      },
    });
  }

  toggleStatus(id: string): void {
    this.http.patch<AppUser>(`${this.apiUrl}/${id}/status`, {}).subscribe({
      next: (updated) => {
        this.users.update((list) =>
          list.map((u) => (u.id === id ? { ...u, isActive: updated.isActive } : u)),
        );
      },
      error: () => {
        this.error.set('Failed to update user status');
      },
    });
  }

  deleteUser(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== id));
      },
      error: () => {
        this.error.set('Failed to delete user');
      },
    });
  }

  create(payload: CreateUserRequest): Observable<AppUser> {
    return this.http.post<AppUser>(this.apiUrl, payload);
  }

  findOne(id: string): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.apiUrl}/${id}`);
  }

  update(id: string, payload: UpdateUserRequest): Observable<AppUser> {
    return this.http.patch<AppUser>(`${this.apiUrl}/${id}`, payload);
  }
}