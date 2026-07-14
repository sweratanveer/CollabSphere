// This file contains the HTTP service for calling the backend Workspace Management API.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '../models/workspace.model';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private apiUrl = `${environment.apiUrl}/workspaces`;

  constructor(private http: HttpClient) {}

  create(payload: CreateWorkspaceRequest): Observable<Workspace> {
    return this.http.post<Workspace>(this.apiUrl, payload);
  }

  findAll(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Workspace> {
    return this.http.get<Workspace>(`${this.apiUrl}/${id}`);
  }

  findByCompany(companyId: string): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${this.apiUrl}/company/${companyId}`);
  }

  update(id: string, payload: UpdateWorkspaceRequest): Observable<Workspace> {
    return this.http.patch<Workspace>(`${this.apiUrl}/${id}`, payload);
  }

  toggleStatus(id: string): Observable<Workspace> {
    return this.http.patch<Workspace>(`${this.apiUrl}/${id}/status`, {});
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
