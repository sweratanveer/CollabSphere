// This file contains the HTTP service and signal-based state store for uploading and managing project files.

import { Injectable, inject, signal } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ProjectFile } from '../models/file.model';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/files`;

  files = signal<ProjectFile[]>([]);
  loading = signal(false);
  error = signal('');
  uploadProgress = signal(0);
  uploading = signal(false);

  loadByProject(projectId: string): void {
    this.loading.set(true);
    this.error.set('');

    this.http
      .get<ProjectFile[]>(`${this.apiUrl}/project/${projectId}`)
      .subscribe({
        next: (data) => {
          this.files.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load files');
          this.loading.set(false);
        },
      });
  }

  upload(
    projectId: string,
    file: File,
  ): Observable<HttpEvent<ProjectFile>> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('projectId', projectId);

    return this.http.post<ProjectFile>(
      `${this.apiUrl}/upload`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      },
    );
  }

  uploadAndTrack(projectId: string, file: File): void {
    this.uploading.set(true);
    this.uploadProgress.set(0);
    this.error.set('');

    this.upload(projectId, file).subscribe({
      next: (event) => {
        if (
          event.type === HttpEventType.UploadProgress &&
          event.total
        ) {
          this.uploadProgress.set(
            Math.round((event.loaded / event.total) * 100),
          );
        }

        if (
          event.type === HttpEventType.Response &&
          event.body
        ) {
          this.files.update((list) => [
            event.body as ProjectFile,
            ...list,
          ]);

          this.uploading.set(false);
          this.uploadProgress.set(0);
        }
      },
      error: () => {
        this.error.set('Failed to upload file');
        this.uploading.set(false);
        this.uploadProgress.set(0);
      },
    });
  }

  // Download file using HttpClient so JWT token is sent
  downloadFile(fileId: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/${fileId}/download`,
      {
        responseType: 'blob',
      },
    );
  }

  deleteFile(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.files.update((list) =>
          list.filter((f) => f.id !== id),
        );
      },
      error: () => {
        this.error.set('Failed to delete file');
      },
    });
  }
}