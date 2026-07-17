// This file provides the form to schedule a new meeting for a selected team, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { MeetingService } from '../../services/meeting';
import { TeamService } from '../../services/team';
import { CreateMeetingRequest } from '../../models/meeting.model';

@Component({
  selector: 'app-meeting-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './meeting-create.html',
  styleUrl: './meeting-create.scss',
})
export class MeetingCreateComponent implements OnInit {
  private meetingService = inject(MeetingService);
  private teamService = inject(TeamService);
  private router = inject(Router);

  title = signal('');
  description = signal('');
  teamId = signal('');
  scheduledAt = signal('');
  durationMinutes = signal(30);

  teams = this.teamService.teams;

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.teamService.loadAll();
  }

  create(): void {
    if (!this.title() || !this.teamId() || !this.scheduledAt()) {
      this.error.set('Title, team, and scheduled time are required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload: CreateMeetingRequest = {
      title: this.title(),
      description: this.description() || undefined,
      teamId: this.teamId(),
      scheduledAt: new Date(this.scheduledAt()).toISOString(),
      durationMinutes: this.durationMinutes(),
    };

    this.meetingService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/meetings']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to schedule meeting');
      },
    });
  }
}