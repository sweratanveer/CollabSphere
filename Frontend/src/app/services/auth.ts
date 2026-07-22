import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl;

  private readonly tokenKey = 'accessToken';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, user);
  }

  saveToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem(this.tokenKey, token);

      sessionStorage.removeItem(this.tokenKey);
    } else {
      sessionStorage.setItem(this.tokenKey, token);

      localStorage.removeItem(this.tokenKey);
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey) ?? localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);

    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    return !!token && !this.isTokenExpired(token);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`);
  }

  getUserRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);

    return payload?.role ?? null;
  }

  hasRole(requiredRole: string): boolean {
    const role = this.getUserRole();

    if (!role || !requiredRole) {
      return false;
    }

    const hierarchy = [
      'CLIENT',

      'EMPLOYEE',

      'TEAM_LEADER',

      'PROJECT_MANAGER',

      'COMPANY_ADMIN',

      'SUPER_ADMIN',
    ];

    const currentIndex = hierarchy.indexOf(role);

    const requiredIndex = hierarchy.indexOf(requiredRole);

    if (currentIndex === -1 || requiredIndex === -1) {
      return role === requiredRole;
    }

    return currentIndex >= requiredIndex;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];

      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);

    if (!payload?.exp) {
      return false;
    }

    return Date.now() >= payload.exp * 1000;
  }
}
