// This file contains the HTTP service, Socket.IO live connection, and signal-based state store for notifications.
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Auth } from './auth';
import { AppNotification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiUrl = `${environment.apiUrl}/notifications`;

  private socket: Socket | null = null;

  notifications = signal<AppNotification[]>([]);
  loading = signal(false);
  error = signal('');

  unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    const token = this.auth.getToken();

    this.socket = io(`${environment.apiUrl}/notifications`, {
      auth: { token },
    });

    this.socket.on('newNotification', (notification: AppNotification) => {
      this.notifications.update((list) => [notification, ...list]);
    });
  }

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<AppNotification[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load notifications');
        this.loading.set(false);
      },
    });
  }

  markAsRead(id: string): void {
    this.http.patch<AppNotification>(`${this.apiUrl}/${id}/read`, {}).subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      },
      error: () => {
        this.error.set('Failed to update notification');
      },
    });
  }

  markAllAsRead(): void {
    this.http.patch<void>(`${this.apiUrl}/read-all`, {}).subscribe({
      next: () => {
        this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
      },
      error: () => {
        this.error.set('Failed to update notifications');
      },
    });
  }

  deleteNotification(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.notifications.update((list) => list.filter((n) => n.id !== id));
      },
      error: () => {
        this.error.set('Failed to delete notification');
      },
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}