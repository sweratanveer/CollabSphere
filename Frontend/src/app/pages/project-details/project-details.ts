// This file displays the full details of a single project using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProjectService } from '../../services/project';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetailsComponent implements OnInit {
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);

  project = signal<Project | null>(null);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!id) {
      this.error.set('Invalid project');
      return;
    }

    this.loading.set(true);

    this.projectService.findOne(id).subscribe({
      next: (project: Project) => {
        this.project.set(project);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load project');
        this.loading.set(false);
      },
    });
  }
}