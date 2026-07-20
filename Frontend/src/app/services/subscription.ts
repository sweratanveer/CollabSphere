// This file contains the HTTP service and signal-based state store for subscription plans and company subscriptions.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  SubscriptionPlan,
  CompanySubscription,
  CreatePlanRequest,
} from '../models/subscription.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/subscriptions`;

  plans = signal<SubscriptionPlan[]>([]);
  subscriptions = signal<CompanySubscription[]>([]);
  loading = signal(false);
  error = signal('');

  loadPlans(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/plans`).subscribe({
      next: (data) => {
        this.plans.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load subscription plans');
        this.loading.set(false);
      },
    });
  }

  loadAllSubscriptions(): void {
    this.http.get<CompanySubscription[]>(this.apiUrl).subscribe({
      next: (data) => this.subscriptions.set(data),
      error: () => this.error.set('Failed to load subscriptions'),
    });
  }

  createPlan(payload: CreatePlanRequest): Observable<SubscriptionPlan> {
    return this.http.post<SubscriptionPlan>(`${this.apiUrl}/plans`, payload);
  }

  deletePlan(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/plans/${id}`).subscribe({
      next: () => {
        this.plans.update((list) => list.filter((p) => p.id !== id));
      },
      error: () => {
        this.error.set('Failed to delete plan');
      },
    });
  }

  subscribe(companyId: string, planId: string): Observable<CompanySubscription> {
    return this.http.post<CompanySubscription>(`${this.apiUrl}/subscribe`, {
      companyId,
      planId,
    });
  }

  findActiveByCompany(companyId: string): Observable<CompanySubscription> {
    return this.http.get<CompanySubscription>(`${this.apiUrl}/company/${companyId}`);
  }
}