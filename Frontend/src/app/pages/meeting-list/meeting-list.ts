// This file lists all scheduled meetings using signals, with options to join or cancel.
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MeetingService } from '../../services/meeting';
import { Meeting } from '../../models/meeting.model';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-meeting-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './meeting-list.html',
  styleUrl: './meeting-list.scss',
})
export class MeetingListComponent implements OnInit {
  private meetingService = inject(MeetingService);
  private router = inject(Router);

  meetings = this.meetingService.meetings;
  loading = this.meetingService.loading;
  error = this.meetingService.error;

  ngOnInit(): void {
    this.meetingService.loadAll();
  }

  join(meeting: Meeting): void {
    this.router.navigate(['/meetings/room', meeting.roomId]);
  }

  cancel(meeting: Meeting): void {
    const confirmed = confirm(`Cancel meeting "${meeting.title}"?`);

    if (!confirmed) {
      return;
    }

    this.meetingService.deleteMeeting(meeting.id);
  }
}