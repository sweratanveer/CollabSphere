// This file displays team details and lets admins add or remove team members, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TeamService } from '../../services/team';
import { UserService } from '../../services/user';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './team-details.html',
  styleUrl: './team-details.scss',
})
export class TeamDetailsComponent implements OnInit {
  private teamService = inject(TeamService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  team = signal<Team | null>(null);
  loading = signal(false);
  error = signal('');

  selectedUserId = signal('');
  users = this.userService.users;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!id) {
      this.error.set('Invalid team');
      return;
    }

    this.userService.loadAll();
    this.loadTeam(id);
  }

  loadTeam(id: string): void {
    this.loading.set(true);

    this.teamService.findOne(id).subscribe({
      next: (team: Team) => {
        this.team.set(team);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load team');
        this.loading.set(false);
      },
    });
  }

  addMember(): void {
    const team = this.team();
    const userId = this.selectedUserId();

    if (!team || !userId) {
      return;
    }

    this.teamService.addMember(team.id, userId).subscribe({
      next: () => {
        this.selectedUserId.set('');
        this.loadTeam(team.id);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to add member');
      },
    });
  }

  removeMember(memberId: string): void {
    const team = this.team();

    if (!team) {
      return;
    }

    const confirmed = confirm('Remove this member from the team?');

    if (!confirmed) {
      return;
    }

    this.teamService.removeMember(team.id, memberId).subscribe({
      next: () => {
        this.loadTeam(team.id);
      },
      error: () => {
        this.error.set('Failed to remove member');
      },
    });
  }
}