import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { WorkspaceService } from '../../services/workspace';

import { Workspace, UpdateWorkspaceRequest, SubscriptionPlan } from '../../models/workspace.model';

@Component({
  selector: 'app-workspace-edit',

  standalone: true,

  imports: [CommonModule, FormsModule, RouterLink],

  templateUrl: './workspace-edit.html',

  styleUrl: './workspace-edit.scss',
})
export class WorkspaceEditComponent implements OnInit {
  workspaceId = '';

  workspaceName = '';

  slug = '';

  timezone = '';

  subscriptionPlan: SubscriptionPlan = 'FREE';

  maxUsers = 5;

  loading = signal<boolean>(false);

  saving = signal<boolean>(false);

  error = signal<string>('');

  constructor(
    private workspaceService: WorkspaceService,

    private route: ActivatedRoute,

    private router: Router,
  ) {}

  ngOnInit(): void {
    this.workspaceId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.workspaceId) {
      this.error.set('Invalid workspace');

      return;
    }

    this.loading.set(true);

    this.workspaceService.findOne(this.workspaceId).subscribe({
      next: (workspace: Workspace) => {
        this.workspaceName = workspace.workspaceName;

        this.slug = workspace.slug;

        this.timezone = workspace.timezone;

        this.subscriptionPlan = workspace.subscriptionPlan;

        this.maxUsers = workspace.maxUsers;

        this.loading.set(false);
      },

      error: (err) => {
        console.log(err);

        this.error.set('Failed to load workspace');

        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);

    this.error.set('');

    const payload: UpdateWorkspaceRequest = {
      workspaceName: this.workspaceName,

      slug: this.slug,

      timezone: this.timezone,

      subscriptionPlan: this.subscriptionPlan,

      maxUsers: this.maxUsers,
    };

    this.workspaceService

      .update(this.workspaceId, payload)

      .subscribe({
        next: () => {
          this.saving.set(false);

          this.router.navigate(['/workspace']);
        },

        error: (err: HttpErrorResponse) => {
          console.log(err);

          this.error.set(err.error?.message || 'Update failed');

          this.saving.set(false);
        },
      });
  }
}
