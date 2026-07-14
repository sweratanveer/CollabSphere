import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { WorkspaceService } from '../../services/workspace';
import { Workspace } from '../../models/workspace.model';

@Component({
  selector: 'app-workspace-details',

  standalone: true,

  imports: [CommonModule, RouterLink],

  templateUrl: './workspace-details.html',

  styleUrl: './workspace-details.scss',
})
export class WorkspaceDetailsComponent implements OnInit {
  workspace = signal<Workspace | null>(null);

  loading = signal<boolean>(false);

  error = signal<string>('');

  constructor(
    private workspaceService: WorkspaceService,

    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Invalid workspace id');

      return;
    }

    this.loading.set(true);

    this.workspaceService

      .findOne(id)

      .subscribe({
        next: (data: Workspace) => {
          this.workspace.set(data);

          this.loading.set(false);
        },

        error: (err) => {
          console.log(err);

          this.error.set('Failed to load workspace');

          this.loading.set(false);
        },
      });
  }
}
