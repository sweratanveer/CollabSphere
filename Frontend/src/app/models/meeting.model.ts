// This file defines the TypeScript interfaces for meeting data.
export interface MeetingTeam {
  id: string;
  teamName: string;
}

export interface MeetingHost {
  id: string;
  fullName: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes: number;
  roomId: string;
  status: string;
  team: MeetingTeam;
  host: MeetingHost;
  createdAt: string;
}

export interface CreateMeetingRequest {
  title: string;
  description?: string;
  teamId: string;
  scheduledAt: string;
  durationMinutes?: number;
}