// This file contains the HTTP service and signal-based state store for Team Collaboration.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamMember,
} from '../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/teams`;

  teams = signal<Team[]>([]);
  loading = signal(false);
  error = signal('');

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<Team[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.teams.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load teams');
        this.loading.set(false);
      },
    });
  }

  toggleStatus(id: string): void {
    this.http.patch<Team>(`${this.apiUrl}/${id}/status`, {}).subscribe({
      next: (updated) => {
        this.teams.update((list) =>
          list.map((t) => (t.id === id ? { ...t, isActive: updated.isActive } : t)),
        );
      },
      error: () => {
        this.error.set('Failed to update team status');
      },
    });
  }

  deleteTeam(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.teams.update((list) => list.filter((t) => t.id !== id));
      },
      error: () => {
        this.error.set('Failed to delete team');
      },
    });
  }

  create(payload: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, payload);
  }

  findOne(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  update(id: string, payload: UpdateTeamRequest): Observable<Team> {
    return this.http.patch<Team>(`${this.apiUrl}/${id}`, payload);
  }

  addMember(teamId: string, userId: string): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${this.apiUrl}/${teamId}/members`, { userId });
  }

  removeMember(teamId: string, memberId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}/members/${memberId}`);
  }
}