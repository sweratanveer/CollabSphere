// This file provides the form to create a new workspace for a selected company.

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { environment } from '../../../environments/environment';
import { WorkspaceService } from '../../services/workspace';
import { CreateWorkspaceRequest, SubscriptionPlan } from '../../models/workspace.model';

interface CompanyOption {
  id: string;
  companyName: string;
}

@Component({
  selector: 'app-workspace-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './workspace-create.html',
  styleUrl: './workspace-create.scss',
})
export class WorkspaceCreateComponent implements OnInit {
  workspaceName = '';

  companyId = '';

  slug = '';

  timezone = 'UTC';

  subscriptionPlan: SubscriptionPlan = 'FREE';

  maxUsers = 5;

  companies = signal<CompanyOption[]>([]);

  loading = signal<boolean>(false);

  error = signal<string>('');

  constructor(
    private workspaceService: WorkspaceService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.http.get<CompanyOption[]>(`${environment.apiUrl}/companies`).subscribe({
      next: (companies) => {
        this.companies.set(companies);
      },

      error: () => {
        this.error.set('Failed to load companies');
      },
    });
  }

  create(): void {
    if (!this.workspaceName || !this.companyId) {
      this.error.set('Workspace name and company are required');

      return;
    }

    this.loading.set(true);

    this.error.set('');

    const payload: CreateWorkspaceRequest = {
      workspaceName: this.workspaceName,

      companyId: this.companyId,

      slug: this.slug || undefined,

      timezone: this.timezone,

      subscriptionPlan: this.subscriptionPlan,

      maxUsers: this.maxUsers,
    };

    this.workspaceService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);

        this.router.navigate(['/workspace']);
      },

      error: (err: HttpErrorResponse) => {
        this.loading.set(false);

        this.error.set(err?.error?.message || 'Failed to create workspace');
      },
    });
  }
}
