// This file provides the form to create a new project under a selected workspace, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { ProjectService } from '../../services/project';
import { WorkspaceService } from '../../services/workspace';
import { UserService } from '../../services/user';
import { CreateProjectRequest, ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './project-create.html',
  styleUrl: './project-create.scss',
})
export class ProjectCreateComponent implements OnInit {
  private projectService = inject(ProjectService);
  private workspaceService = inject(WorkspaceService);
  private userService = inject(UserService);
  private router = inject(Router);

  projectName = signal('');
  description = signal('');
  workspaceId = signal('');
  projectManagerId = signal('');
  status = signal<ProjectStatus>('PLANNING');
  startDate = signal('');
  endDate = signal('');

  workspaces = this.workspaceService.workspaces;
  users = this.userService.users;

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.workspaceService.loadAll();
    this.userService.loadAll();
  }

  create(): void {
    if (!this.projectName() || !this.workspaceId()) {
      this.error.set('Project name and workspace are required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload: CreateProjectRequest = {
      projectName: this.projectName(),
      description: this.description() || undefined,
      workspaceId: this.workspaceId(),
      projectManagerId: this.projectManagerId() || undefined,
      status: this.status(),
      startDate: this.startDate() || undefined,
      endDate: this.endDate() || undefined,
    };

    this.projectService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/projects']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to create project');
      },
    });
  }
}