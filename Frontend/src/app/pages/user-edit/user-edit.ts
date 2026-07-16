// This file provides the form to edit an existing user's role, company, and status, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserService } from '../../services/user';
import { WorkspaceService } from '../../services/workspace';
import { AppUser, UpdateUserRequest, UserRole } from '../../models/user.model';
import { CompanyOption } from '../../models/workspace.model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
})
export class UserEditComponent implements OnInit {
  private userService = inject(UserService);
  private workspaceService = inject(WorkspaceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userId = signal('');
  fullName = signal('');
  role = signal<UserRole>('EMPLOYEE');
  companyId = signal('');
  isActive = signal(true);

  companies = signal<CompanyOption[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.userId.set(id);

    if (!id) {
      this.error.set('Invalid user');
      return;
    }

    this.workspaceService.getCompanies().subscribe({
      next: (companies) => this.companies.set(companies),
      error: () => this.error.set('Failed to load companies'),
    });

    this.loading.set(true);

    this.userService.findOne(id).subscribe({
      next: (user: AppUser) => {
        this.fullName.set(user.fullName);
        this.role.set(user.role);
        this.companyId.set(user.company?.id ?? '');
        this.isActive.set(user.isActive);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load user');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.error.set('');

    const payload: UpdateUserRequest = {
      fullName: this.fullName(),
      role: this.role(),
      companyId: this.companyId() || undefined,
      isActive: this.isActive(),
    };

    this.userService.update(this.userId(), payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/users']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || 'Failed to update user');
      },
    });
  }
}