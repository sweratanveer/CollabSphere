// This file contains the HTTP service and signal-based state store for Scheduling & Calendar.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  CalendarEvent,
  CreateEventRequest,
  UpdateEventRequest,
} from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/events`;

  events = signal<CalendarEvent[]>([]);
  loading = signal(false);
  error = signal('');

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<CalendarEvent[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.events.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load events');
        this.loading.set(false);
      },
    });
  }

  deleteEvent(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.events.update((list) => list.filter((e) => e.id !== id));
      },
      error: () => {
        this.error.set('Failed to delete event');
      },
    });
  }

  create(payload: CreateEventRequest): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(this.apiUrl, payload);
  }

  findOne(id: string): Observable<CalendarEvent> {
    return this.http.get<CalendarEvent>(`${this.apiUrl}/${id}`);
  }

  update(id: string, payload: UpdateEventRequest): Observable<CalendarEvent> {
    return this.http.patch<CalendarEvent>(`${this.apiUrl}/${id}`, payload);
  }
}