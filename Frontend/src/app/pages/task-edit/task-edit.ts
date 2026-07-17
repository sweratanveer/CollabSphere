// This file provides the form to edit an existing task's details, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TaskService } from '../../services/task';
import { UserService } from '../../services/user';
import { Task, UpdateTaskRequest, TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './task-edit.html',
  styleUrl: './task-edit.scss',
})
export class TaskEditComponent implements OnInit {
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  taskId = signal('');
  title = signal('');
  description = signal('');
  assignedToId = signal('');
  status = signal<TaskStatus>('TODO');
  priority = signal<TaskPriority>('MEDIUM');
  dueDate = signal('');

  users = this.userService.users;

  loading = signal(false);
  saving = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.taskId.set(id);

    if (!id) {
      this.error.set('Invalid task');
      return;
    }

    this.userService.loadAll();
    this.loading.set(true);

    this.taskService.findOne(id).subscribe({
      next: (task: Task) => {
        this.title.set(task.title);
        this.description.set(task.description ?? '');
        this.assignedToId.set(task.assignedTo?.id ?? '');
        this.status.set(task.status);
        this.priority.set(task.priority);
        this.dueDate.set(task.dueDate ?? '');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load task');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.error.set('');

    const payload: UpdateTaskRequest = {
      title: this.title(),
      description: this.description(),
      assignedToId: this.assignedToId() || undefined,
      status: this.status(),
      priority: this.priority(),
      dueDate: this.dueDate() || undefined,
    };

    this.taskService.update(this.taskId(), payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/tasks']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || 'Failed to update task');
      },
    });
  }
}