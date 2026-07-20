// This file provides the form to create a new calendar event under a selected workspace, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { ScheduleService } from '../../services/schedule';
import { WorkspaceService } from '../../services/workspace';
import { CreateEventRequest, EventType } from '../../models/event.model';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './event-create.html',
  styleUrl: './event-create.scss',
})
export class EventCreateComponent implements OnInit {
  private scheduleService = inject(ScheduleService);
  private workspaceService = inject(WorkspaceService);
  private router = inject(Router);

  title = signal('');
  description = signal('');
  type = signal<EventType>('OTHER');
  workspaceId = signal('');
  startTime = signal('');
  endTime = signal('');
  allDay = signal(false);

  workspaces = this.workspaceService.workspaces;

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.workspaceService.loadAll();
  }

  create(): void {
    if (!this.title() || !this.workspaceId() || !this.startTime() || !this.endTime()) {
      this.error.set('Title, workspace, start time, and end time are required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload: CreateEventRequest = {
      title: this.title(),
      description: this.description() || undefined,
      type: this.type(),
      workspaceId: this.workspaceId(),
      startTime: new Date(this.startTime()).toISOString(),
      endTime: new Date(this.endTime()).toISOString(),
      allDay: this.allDay(),
    };

    this.scheduleService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/calendar']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to create event');
      },
    });
  }
}