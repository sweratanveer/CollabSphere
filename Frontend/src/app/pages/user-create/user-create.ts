// This file provides the form to create a new user account, using signals for local form state.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { UserService } from '../../services/user';
import { WorkspaceService } from '../../services/workspace';
import { CreateUserRequest, UserRole } from '../../models/user.model';
import { CompanyOption } from '../../models/workspace.model';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './user-create.html',
  styleUrl: './user-create.scss',
})
export class UserCreateComponent implements OnInit {
  private userService = inject(UserService);
  private workspaceService = inject(WorkspaceService);
  private router = inject(Router);

  fullName = signal('');
  email = signal('');
  password = signal('');
  role = signal<UserRole>('EMPLOYEE');
  companyId = signal('');

  companies = signal<CompanyOption[]>([]);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.workspaceService.getCompanies().subscribe({
      next: (companies) => this.companies.set(companies),
      error: () => this.error.set('Failed to load companies'),
    });
  }

  create(): void {
    if (!this.fullName() || !this.email() || !this.password()) {
      this.error.set('Full name, email, and password are required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload: CreateUserRequest = {
      fullName: this.fullName(),
      email: this.email(),
      password: this.password(),
      role: this.role(),
      companyId: this.companyId() || undefined,
    };

    this.userService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/users']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to create user');
      },
    });
  }
}