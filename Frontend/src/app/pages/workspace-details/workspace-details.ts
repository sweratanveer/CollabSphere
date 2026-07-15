// This file displays the full details of a single workspace using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { WorkspaceService } from '../../services/workspace';
import { Workspace } from '../../models/workspace.model';

@Component({
  selector: 'app-workspace-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './workspace-details.html',
  styleUrl: './workspace-details.scss',
})
export class WorkspaceDetailsComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);
  private route = inject(ActivatedRoute);

  workspace = signal<Workspace | null>(null);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!id) {
      this.error.set('Invalid workspace');
      return;
    }

    this.loading.set(true);

    this.workspaceService.findOne(id).subscribe({
      next: (workspace: Workspace) => {
        this.workspace.set(workspace);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load workspace');
        this.loading.set(false);
      },
    });
  }
}