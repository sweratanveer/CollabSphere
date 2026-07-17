// This file provides the file manager page for a project: upload, list, download, and delete files, using signals.

import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { FileService } from '../../services/file';
import { ProjectService } from '../../services/project';
import { ProjectFile } from '../../models/file.model';

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './file-manager.html',
  styleUrl: './file-manager.scss',
})
export class FileManagerComponent implements OnInit {
  private fileService = inject(FileService);
  private projectService = inject(ProjectService);

  projects = this.projectService.projects;
  files = this.fileService.files;
  loading = this.fileService.loading;
  error = this.fileService.error;
  uploading = this.fileService.uploading;
  uploadProgress = this.fileService.uploadProgress;

  selectedProjectId = signal('');
  selectedFile = signal<File | null>(null);

  ngOnInit(): void {
    this.projectService.loadAll();
  }

  selectProject(projectId: string): void {
    this.selectedProjectId.set(projectId);

    if (projectId) {
      this.fileService.loadByProject(projectId);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] ?? null);
  }

  upload(): void {
    const projectId = this.selectedProjectId();
    const file = this.selectedFile();

    if (!projectId || !file) {
      return;
    }

    this.fileService.uploadAndTrack(projectId, file);
    this.selectedFile.set(null);
  }

  download(file: ProjectFile): void {
    this.fileService.downloadFile(file.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = file.originalName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed:', err);
        alert('Failed to download file.');
      },
    });
  }

  remove(file: ProjectFile): void {
    const confirmed = confirm(`Delete "${file.originalName}"?`);

    if (!confirmed) {
      return;
    }

    this.fileService.deleteFile(file.id);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}