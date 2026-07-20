// This file displays the logged-in user's profile information and allows updating the full name, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Auth } from '../../services/auth';

interface ProfileUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  company?: { id: string; companyName: string } | null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  user = signal<ProfileUser | null>(null);
  fullName = signal('');

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loading.set(true);

    this.auth.getProfile().subscribe({
      next: (response: any) => {
        const userData: ProfileUser = response.user ?? response;
        this.user.set(userData);
        this.fullName.set(userData.fullName ?? '');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load profile');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.error.set('');
    this.successMessage.set('');

    this.http
      .patch(`${environment.apiUrl}/users/profile`, { fullName: this.fullName() })
      .subscribe({
        next: (response: any) => {
          const userData: ProfileUser = response.user ?? response;
          this.user.set(userData);
          this.saving.set(false);
          this.successMessage.set('Profile updated successfully.');

          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(err?.error?.message || 'Failed to update profile');
        },
      });
  }
}