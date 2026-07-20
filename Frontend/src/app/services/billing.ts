// This file contains the HTTP service for starting Stripe checkout and listing invoices.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Invoice, CheckoutResponse } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/billing`;

  invoices = signal<Invoice[]>([]);
  loading = signal(false);
  error = signal('');

  startCheckout(companyId: string, planId: string): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/checkout`, { companyId, planId });
  }

  loadByCompany(companyId: string): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<Invoice[]>(`${this.apiUrl}/invoices/company/${companyId}`).subscribe({
      next: (data) => {
        this.invoices.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load invoices');
        this.loading.set(false);
      },
    });
  }
}