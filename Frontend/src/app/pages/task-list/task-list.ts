// This file lists all tasks using signals, with options to view, edit, change status, or delete.
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TaskService } from '../../services/task';
import { Task, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);

  tasks = this.taskService.tasks;
  loading = this.taskService.loading;
  error = this.taskService.error;

  ngOnInit(): void {
    this.taskService.loadAll();
  }

  changeStatus(task: Task, status: TaskStatus): void {
    this.taskService.updateStatus(task.id, status);
  }

  deleteTask(task: Task): void {
    const confirmed = confirm(`Delete task "${task.title}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(task.id);
  }
}