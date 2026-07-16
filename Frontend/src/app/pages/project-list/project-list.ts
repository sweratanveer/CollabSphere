// This file lists all projects using signals, with options to view, edit, toggle status, or delete.
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProjectService } from '../../services/project';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);

  projects = this.projectService.projects;
  loading = this.projectService.loading;
  error = this.projectService.error;

  ngOnInit(): void {
    this.projectService.loadAll();
  }

  toggleStatus(project: Project): void {
    this.projectService.toggleStatus(project.id);
  }

  deleteProject(project: Project): void {
    const confirmed = confirm(`Delete project "${project.projectName}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    this.projectService.deleteProject(project.id);
  }
}