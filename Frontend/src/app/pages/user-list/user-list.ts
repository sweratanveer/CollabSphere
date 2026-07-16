// This file lists all users using signals, with options to view, edit, toggle status, or delete.
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserService } from '../../services/user';
import { AppUser } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  users = this.userService.users;
  loading = this.userService.loading;
  error = this.userService.error;

  ngOnInit(): void {
    this.userService.loadAll();
  }

  toggleStatus(user: AppUser): void {
    this.userService.toggleStatus(user.id);
  }

  deleteUser(user: AppUser): void {
    const confirmed = confirm(`Delete user "${user.fullName}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    this.userService.deleteUser(user.id);
  }
}