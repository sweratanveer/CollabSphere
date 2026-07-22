// This file provides the form to create a new project under a selected company and workspace, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { ProjectService } from '../../services/project';
import { WorkspaceService } from '../../services/workspace';
import { UserService } from '../../services/user';
import { CreateProjectRequest, ProjectStatus } from '../../models/project.model';
import { CompanyOption, Workspace } from '../../models/workspace.model';

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
  companyId = signal('');
  workspaceId = signal('');
  projectManagerId = signal('');
  status = signal<ProjectStatus>('PLANNING');
  startDate = signal('');
  endDate = signal('');

  companies = signal<CompanyOption[]>([]);
  workspacesForCompany = signal<Workspace[]>([]);
  users = this.userService.users;

  loading = signal(false);
  loadingWorkspaces = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.userService.loadAll();

    this.workspaceService.getCompanies().subscribe({
      next: (data) => this.companies.set(data),
      error: () => this.error.set('Failed to load companies'),
    });
  }

  // Company badalte hi uski workspaces load karein, aur pehle se select ki hui workspace clear karein
  onCompanyChange(id: string): void {
    this.companyId.set(id);
    this.workspaceId.set('');
    this.workspacesForCompany.set([]);

    if (!id) {
      return;
    }

    this.loadingWorkspaces.set(true);

    this.workspaceService.findByCompany(id).subscribe({
      next: (data) => {
        this.workspacesForCompany.set(data);
        this.loadingWorkspaces.set(false);
      },
      error: () => {
        this.error.set('Failed to load workspaces for this company');
        this.loadingWorkspaces.set(false);
      },
    });
  }

  create(): void {
    if (!this.projectName() || !this.companyId() || !this.workspaceId()) {
      this.error.set('Project name, company, and workspace are required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload: CreateProjectRequest = {
      projectName: this.projectName(),
      description: this.description() || undefined,
      companyId: this.companyId(),
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