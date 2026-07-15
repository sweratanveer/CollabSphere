// This file provides the form to create a new workspace for a selected company, using signals for local form state.
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { WorkspaceService } from '../../services/workspace';
import { FormsModule } from '@angular/forms';
import {
  CreateWorkspaceRequest,
  SubscriptionPlan,
  CompanyOption,
} from '../../models/workspace.model';

@Component({
  selector: 'app-workspace-create',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './workspace-create.html',
  styleUrl: './workspace-create.scss',
})
export class WorkspaceCreateComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);
  private router = inject(Router);

  workspaceName = signal('');
  companyId = signal('');
  slug = signal('');
  timezone = signal('UTC');
  subscriptionPlan = signal<SubscriptionPlan>('FREE');
  maxUsers = signal(5);

  companies = signal<CompanyOption[]>([]);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.workspaceService.getCompanies().subscribe({
      next: (companies) => this.companies.set(companies),
      error: () => this.error.set('Failed to load companies'),
    });
  }

  create(): void {
    if (!this.workspaceName() || !this.companyId()) {
      this.error.set('Workspace name and company are required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload: CreateWorkspaceRequest = {
      workspaceName: this.workspaceName(),
      companyId: this.companyId(),
      slug: this.slug() || undefined,
      timezone: this.timezone(),
      subscriptionPlan: this.subscriptionPlan(),
      maxUsers: this.maxUsers(),
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
