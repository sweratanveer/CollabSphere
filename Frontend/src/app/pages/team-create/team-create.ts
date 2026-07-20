// This file provides the form to create a new team under a selected workspace, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { TeamService } from '../../services/team';
import { WorkspaceService } from '../../services/workspace';
import { UserService } from '../../services/user';
import { CreateTeamRequest } from '../../models/team.model';

@Component({
  selector: 'app-team-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './team-create.html',
  styleUrl: './team-create.scss',
})
export class TeamCreateComponent implements OnInit {
  private teamService = inject(TeamService);
  private workspaceService = inject(WorkspaceService);
  private userService = inject(UserService);
  private router = inject(Router);

  teamName = signal('');
  description = signal('');
  workspaceId = signal('');
  teamLeaderId = signal('');

  workspaces = this.workspaceService.workspaces;
  users = this.userService.users;

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.workspaceService.loadAll();
    this.userService.loadAll();
  }

  create(): void {
    if (!this.teamName() || !this.workspaceId()) {
      this.error.set('Team name and workspace are required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload: CreateTeamRequest = {
      teamName: this.teamName(),
      description: this.description() || undefined,
      workspaceId: this.workspaceId(),
      teamLeaderId: this.teamLeaderId() || undefined,
    };

    this.teamService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/teams']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to create team');
      },
    });
  }
}