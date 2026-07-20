// This file provides the account settings page: profile info tab, password change tab, and logout, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { Auth } from '../../services/auth';

type SettingsTab = 'account' | 'security';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private router = inject(Router);

  activeTab = signal<SettingsTab>('account');

  email = signal('');
  role = signal('');

  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loading.set(true);

    this.auth.getProfile().subscribe({
      next: (response: any) => {
        const userData = response.user ?? response;
        this.email.set(userData.email ?? '');
        this.role.set(userData.role ?? '');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load account details');
        this.loading.set(false);
      },
    });
  }

  setTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
    this.error.set('');
    this.successMessage.set('');
  }

  changePassword(): void {
    if (!this.currentPassword() || !this.newPassword()) {
      this.error.set('Current and new password are required');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.error.set('New password and confirmation do not match');
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.successMessage.set('');

    this.http
      .patch(`${environment.apiUrl}/users/profile`, {
        currentPassword: this.currentPassword(),
        password: this.newPassword(),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set('Password updated successfully.');
          this.currentPassword.set('');
          this.newPassword.set('');
          this.confirmPassword.set('');
        },
        error: (err: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(err?.error?.message || 'Failed to update password');
        },
      });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}