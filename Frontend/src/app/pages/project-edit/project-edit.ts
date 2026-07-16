// This file provides the form to edit an existing project's details, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProjectService } from '../../services/project';
import { UserService } from '../../services/user';
import { Project, UpdateProjectRequest, ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './project-edit.html',
  styleUrl: './project-edit.scss',
})
export class ProjectEditComponent implements OnInit {
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  projectId = signal('');
  projectName = signal('');
  description = signal('');
  projectManagerId = signal('');
  status = signal<ProjectStatus>('PLANNING');
  startDate = signal('');
  endDate = signal('');
  isActive = signal(true);

  users = this.userService.users;

  loading = signal(false);
  saving = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.projectId.set(id);

    if (!id) {
      this.error.set('Invalid project');
      return;
    }

    this.userService.loadAll();
    this.loading.set(true);

    this.projectService.findOne(id).subscribe({
      next: (project: Project) => {
        this.projectName.set(project.projectName);
        this.description.set(project.description ?? '');
        this.projectManagerId.set(project.projectManager?.id ?? '');
        this.status.set(project.status);
        this.startDate.set(project.startDate ?? '');
        this.endDate.set(project.endDate ?? '');
        this.isActive.set(project.isActive);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load project');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.error.set('');

    const payload: UpdateProjectRequest = {
      projectName: this.projectName(),
      description: this.description(),
      projectManagerId: this.projectManagerId() || undefined,
      status: this.status(),
      startDate: this.startDate() || undefined,
      endDate: this.endDate() || undefined,
      isActive: this.isActive(),
    };

    this.projectService.update(this.projectId(), payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/projects']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || 'Failed to update project');
      },
    });
  }
}