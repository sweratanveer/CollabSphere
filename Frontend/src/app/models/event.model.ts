// This file defines the TypeScript interfaces for calendar event data.
export type EventType = 'MEETING' | 'TASK_DEADLINE' | 'REMINDER' | 'OTHER';

export interface EventWorkspace {
  id: string;
  workspaceName: string;
}

export interface EventCreator {
  id: string;
  fullName: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startTime: string;
  endTime: string;
  allDay: boolean;
  workspace: EventWorkspace;
  createdBy: EventCreator;
  createdAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  type?: EventType;
  workspaceId: string;
  startTime: string;
  endTime: string;
  allDay?: boolean;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  type?: EventType;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
}