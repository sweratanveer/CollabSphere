import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { WorkspaceService } from '../../services/workspace';
import { Workspace } from '../../models/workspace.model';

@Component({
  selector: 'app-workspace-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './workspace-list.html',
  styleUrl: './workspace-list.scss',
})
export class WorkspaceListComponent implements OnInit {
  workspaces = signal<Workspace[]>([]);

  loading = signal<boolean>(false);

  error = signal<string>('');

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  async loadWorkspaces(): Promise<void> {
    this.loading.set(true);

    this.error.set('');

    try {
      const response = await firstValueFrom(this.workspaceService.findAll());

      console.log('Workspace Response:', response);

      this.workspaces.set(response);
    } catch (error) {
      console.log(error);

      this.error.set('Unable to load workspaces');
    } finally {
      this.loading.set(false);
    }
  }

  async toggleStatus(workspace: Workspace): Promise<void> {
    try {
      const updated = await firstValueFrom(this.workspaceService.toggleStatus(workspace.id));

      this.workspaces.update((items) =>
        items.map((item) => (item.id === workspace.id ? updated : item)),
      );
    } catch {
      this.error.set('Status update failed');
    }
  }

  async deleteWorkspace(workspace: Workspace): Promise<void> {
    const confirmed = confirm(`Delete ${workspace.workspaceName}?`);

    if (!confirmed) return;

    try {
      await firstValueFrom(this.workspaceService.remove(workspace.id));

      this.workspaces.update((items) => items.filter((item) => item.id !== workspace.id));
    } catch {
      this.error.set('Delete failed');
    }
  }
}
