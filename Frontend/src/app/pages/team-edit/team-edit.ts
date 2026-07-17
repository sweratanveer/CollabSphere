// This file provides the form to edit an existing team's details, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TeamService } from '../../services/team';
import { UserService } from '../../services/user';
import { Team, UpdateTeamRequest } from '../../models/team.model';

@Component({
  selector: 'app-team-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './team-edit.html',
  styleUrl: './team-edit.scss',
})
export class TeamEditComponent implements OnInit {
  private teamService = inject(TeamService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  teamId = signal('');
  teamName = signal('');
  description = signal('');
  teamLeaderId = signal('');
  isActive = signal(true);

  users = this.userService.users;

  loading = signal(false);
  saving = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.teamId.set(id);

    if (!id) {
      this.error.set('Invalid team');
      return;
    }

    this.userService.loadAll();
    this.loading.set(true);

    this.teamService.findOne(id).subscribe({
      next: (team: Team) => {
        this.teamName.set(team.teamName);
        this.description.set(team.description ?? '');
        this.teamLeaderId.set(team.teamLeader?.id ?? '');
        this.isActive.set(team.isActive);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load team');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.error.set('');

    const payload: UpdateTeamRequest = {
      teamName: this.teamName(),
      description: this.description(),
      teamLeaderId: this.teamLeaderId() || undefined,
      isActive: this.isActive(),
    };

    this.teamService.update(this.teamId(), payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/teams']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || 'Failed to update team');
      },
    });
  }
}