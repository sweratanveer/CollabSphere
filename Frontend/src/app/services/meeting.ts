// This file contains the HTTP service and signal-based state store for scheduling and listing meetings.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Meeting, CreateMeetingRequest } from '../models/meeting.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/meetings`;

  meetings = signal<Meeting[]>([]);
  loading = signal(false);
  error = signal('');

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<Meeting[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.meetings.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load meetings');
        this.loading.set(false);
      },
    });
  }

  deleteMeeting(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.meetings.update((list) => list.filter((m) => m.id !== id));
      },
      error: () => {
        this.error.set('Failed to cancel meeting');
      },
    });
  }

  create(payload: CreateMeetingRequest): Observable<Meeting> {
    return this.http.post<Meeting>(this.apiUrl, payload);
  }

  findByRoomId(roomId: string): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/room/${roomId}`);
  }
}