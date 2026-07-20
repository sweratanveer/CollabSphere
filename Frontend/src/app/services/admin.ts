// This file contains the HTTP service and signal-based state store for the Super Admin system dashboard.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import {
  SystemOverview,
  RecentCompany,
  UsersByRole,
  CompanyGrowthPoint,
} from '../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  overview = signal<SystemOverview | null>(null);
  recentCompanies = signal<RecentCompany[]>([]);
  usersByRole = signal<UsersByRole[]>([]);
  companyGrowth = signal<CompanyGrowthPoint[]>([]);

  loading = signal(false);
  error = signal('');

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<SystemOverview>(`${this.apiUrl}/overview`).subscribe({
      next: (data) => this.overview.set(data),
      error: () => this.error.set('Failed to load system overview'),
    });

    this.http.get<RecentCompany[]>(`${this.apiUrl}/recent-companies`).subscribe({
      next: (data) => this.recentCompanies.set(data),
      error: () => this.error.set('Failed to load recent companies'),
    });

    this.http.get<UsersByRole[]>(`${this.apiUrl}/users-by-role`).subscribe({
      next: (data) => this.usersByRole.set(data),
      error: () => this.error.set('Failed to load user role breakdown'),
    });

    this.http.get<CompanyGrowthPoint[]>(`${this.apiUrl}/company-growth`).subscribe({
      next: (data) => {
        this.companyGrowth.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load company growth data');
        this.loading.set(false);
      },
    });
  }
}