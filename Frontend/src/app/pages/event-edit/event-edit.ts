// This file provides the form to edit an existing calendar event, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ScheduleService } from '../../services/schedule';
import { CalendarEvent, UpdateEventRequest, EventType } from '../../models/event.model';

function toLocalInput(iso: string): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './event-edit.html',
  styleUrl: './event-edit.scss',
})
export class EventEditComponent implements OnInit {
  private scheduleService = inject(ScheduleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  eventId = signal('');
  title = signal('');
  description = signal('');
  type = signal<EventType>('OTHER');
  startTime = signal('');
  endTime = signal('');
  allDay = signal(false);

  loading = signal(false);
  saving = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.eventId.set(id);

    if (!id) {
      this.error.set('Invalid event');
      return;
    }

    this.loading.set(true);

    this.scheduleService.findOne(id).subscribe({
      next: (event: CalendarEvent) => {
        this.title.set(event.title);
        this.description.set(event.description ?? '');
        this.type.set(event.type);
        this.startTime.set(toLocalInput(event.startTime));
        this.endTime.set(toLocalInput(event.endTime));
        this.allDay.set(event.allDay);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load event');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.error.set('');

    const payload: UpdateEventRequest = {
      title: this.title(),
      description: this.description(),
      type: this.type(),
      startTime: new Date(this.startTime()).toISOString(),
      endTime: new Date(this.endTime()).toISOString(),
      allDay: this.allDay(),
    };

    this.scheduleService.update(this.eventId(), payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/calendar']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || 'Failed to update event');
      },
    });
  }
}