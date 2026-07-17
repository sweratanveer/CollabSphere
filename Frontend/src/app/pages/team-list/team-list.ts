// This file lists all teams using signals, with options to view, edit, toggle status, or delete.
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TeamService } from '../../services/team';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './team-list.html',
  styleUrl: './team-list.scss',
})
export class TeamListComponent implements OnInit {
  private teamService = inject(TeamService);

  teams = this.teamService.teams;
  loading = this.teamService.loading;
  error = this.teamService.error;

  ngOnInit(): void {
    this.teamService.loadAll();
  }

  toggleStatus(team: Team): void {
    this.teamService.toggleStatus(team.id);
  }

  deleteTeam(team: Team): void {
    const confirmed = confirm(`Delete team "${team.teamName}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    this.teamService.deleteTeam(team.id);
  }
}