// This file lists all workspaces using signals, with options to view, edit, toggle status, or delete.
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WorkspaceService } from '../../services/workspace';
import { Workspace } from '../../models/workspace.model';

@Component({
  selector: 'app-workspace-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './workspace-list.html',
  styleUrl: './workspace-list.scss',
})
export class WorkspaceListComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);

  workspaces = this.workspaceService.workspaces;
  loading = this.workspaceService.loading;
  error = this.workspaceService.error;

  ngOnInit(): void {
    this.workspaceService.loadAll();
  }

  toggleStatus(workspace: Workspace): void {
    this.workspaceService.toggleStatus(workspace.id);
  }

  deleteWorkspace(workspace: Workspace): void {
    const confirmed = confirm(
      `Delete workspace "${workspace.workspaceName}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    this.workspaceService.deleteWorkspace(workspace.id);
  }
}