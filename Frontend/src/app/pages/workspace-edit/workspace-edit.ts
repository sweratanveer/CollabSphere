// This file provides the form to edit an existing workspace's details, using signals for local form state.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { WorkspaceService } from '../../services/workspace';
import { UpdateWorkspaceRequest, SubscriptionPlan, Workspace } from '../../models/workspace.model';

@Component({
  selector: 'app-workspace-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './workspace-edit.html',
  styleUrl: './workspace-edit.scss',
})
export class WorkspaceEditComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  workspaceId = signal('');
  workspaceName = signal('');
  slug = signal('');
  timezone = signal('');
  subscriptionPlan = signal<SubscriptionPlan>('FREE');
  maxUsers = signal(5);

  loading = signal(false);
  saving = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.workspaceId.set(id);

    if (!id) {
      this.error.set('Invalid workspace');
      return;
    }

    this.loading.set(true);

    this.workspaceService.findOne(id).subscribe({
      next: (workspace: Workspace) => {
        this.workspaceName.set(workspace.workspaceName);
        this.slug.set(workspace.slug);
        this.timezone.set(workspace.timezone);
        this.subscriptionPlan.set(workspace.subscriptionPlan);
        this.maxUsers.set(workspace.maxUsers);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load workspace');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.error.set('');

    const payload: UpdateWorkspaceRequest = {
      workspaceName: this.workspaceName(),
      slug: this.slug(),
      timezone: this.timezone(),
      subscriptionPlan: this.subscriptionPlan(),
      maxUsers: this.maxUsers(),
    };

    this.workspaceService.update(this.workspaceId(), payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/workspace']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || 'Failed to update workspace');
      },
    });
  }
}
