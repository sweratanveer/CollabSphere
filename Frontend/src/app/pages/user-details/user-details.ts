// This file displays the full details of a single user using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { UserService } from '../../services/user';
import { AppUser } from '../../models/user.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetailsComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  user = signal<AppUser | null>(null);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!id) {
      this.error.set('Invalid user');
      return;
    }

    this.loading.set(true);

    this.userService.findOne(id).subscribe({
      next: (user: AppUser) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load user');
        this.loading.set(false);
      },
    });
  }
}