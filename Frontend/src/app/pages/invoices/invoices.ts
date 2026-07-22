// This file displays the invoice/payment history for a selected company, using signals.
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';

import { BillingService } from '../../services/billing';
import { CompanyService } from '../../company/services/company';

interface CompanyOption {
  id: string;
  companyName: string;
}

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [DatePipe, DecimalPipe, UpperCasePipe],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss',
})
export class InvoicesComponent implements OnInit {
  private billingService = inject(BillingService);
  private companyService = inject(CompanyService);

  invoices = this.billingService.invoices;
  loading = this.billingService.loading;
  error = this.billingService.error;

  selectedCompanyId = signal('');

  // Company list ab seedha CompanyService ke shared signal se derive hoti hai —
  // yani jahan bhi company create/delete/update ho, ye khud-ba-khud update hogi.
  companies = computed<CompanyOption[]>(() =>
    this.companyService
      .companies()
      .filter((c) => !!c.id)
      .map((c) => ({ id: c.id!, companyName: c.companyName })),
  );

  ngOnInit(): void {
    this.companyService.fetchCompanies().subscribe({
      error: () => {},
    });
  }

  selectCompany(companyId: string): void {
    this.selectedCompanyId.set(companyId);

    if (companyId) {
      this.billingService.loadByCompany(companyId);
    }
  }
}