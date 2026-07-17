// This file displays the full details of a single task using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '../../services/task';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
})
export class TaskDetailsComponent implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);

  task = signal<Task | null>(null);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!id) {
      this.error.set('Invalid task');
      return;
    }

    this.loading.set(true);

    this.taskService.findOne(id).subscribe({
      next: (task: Task) => {
        this.task.set(task);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load task');
        this.loading.set(false);
      },
    });
  }
}