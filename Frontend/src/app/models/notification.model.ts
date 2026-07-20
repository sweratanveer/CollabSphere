// This file defines the TypeScript interface for a notification.
export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_UPDATED'
  | 'DEADLINE_APPROACHING'
  | 'MEETING_SCHEDULED'
  | 'CHAT_MESSAGE'
  | 'PROJECT_UPDATED'
  | 'TEAM_INVITE'
  | 'GENERAL';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: string;
}