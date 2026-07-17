// This file provides the form to create a new task under a selected project, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { TaskService } from '../../services/task';
import { ProjectService } from '../../services/project';
import { UserService } from '../../services/user';
import { CreateTaskRequest, TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './task-create.html',
  styleUrl: './task-create.scss',
})
export class TaskCreateComponent implements OnInit {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private router = inject(Router);

  title = signal('');
  description = signal('');
  projectId = signal('');
  assignedToId = signal('');
  status = signal<TaskStatus>('TODO');
  priority = signal<TaskPriority>('MEDIUM');
  dueDate = signal('');

  projects = this.projectService.projects;
  users = this.userService.users;

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.projectService.loadAll();
    this.userService.loadAll();
  }

  create(): void {
    if (!this.title() || !this.projectId()) {
      this.error.set('Title and project are required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload: CreateTaskRequest = {
      title: this.title(),
      description: this.description() || undefined,
      projectId: this.projectId(),
      assignedToId: this.assignedToId() || undefined,
      status: this.status(),
      priority: this.priority(),
      dueDate: this.dueDate() || undefined,
    };

    this.taskService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/tasks']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to create task');
      },
    });
  }
}