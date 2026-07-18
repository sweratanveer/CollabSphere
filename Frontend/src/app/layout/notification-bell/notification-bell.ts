// This file provides the notification bell dropdown shown in the navbar, using signals for unread count and live updates.
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { NotificationService } from '../../services/notification';
import { AppNotification } from '../../models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.scss',
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  notifications = this.notificationService.notifications;
  unreadCount = this.notificationService.unreadCount;

  isOpen = signal(false);

  ngOnInit(): void {
    this.notificationService.connect();
    this.notificationService.loadAll();
  }

  ngOnDestroy(): void {
    this.notificationService.disconnect();
  }

  toggleDropdown(): void {
    this.isOpen.update((open) => !open);
  }

  openNotification(notification: AppNotification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id);
    }

    this.isOpen.set(false);

    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  removeNotification(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(id);
  }
}