import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CompanyService } from '../../services/company';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './company-list.html',
  styleUrl: './company-list.scss',
})
export class CompanyListComponent {
  private readonly companyService = inject(CompanyService);
  private readonly router = inject(Router);

  // Service signal
  readonly companies = this.companyService.companies;

  constructor() {
    this.loadCompanies();
  }

  async loadCompanies(): Promise<void> {
    try {
      await firstValueFrom(this.companyService.fetchCompanies());
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  }

  async deleteCompany(id: string): Promise<void> {
    if (!confirm('Delete this company?')) {
      return;
    }

    try {
      await firstValueFrom(this.companyService.deleteCompany(id));
    } catch (error) {
      console.error('Failed to delete company:', error);
    }
  }

  viewCompany(id: string): void {
    this.router.navigate(['/company/details', id]);
  }

  editCompany(id: string): void {
    this.router.navigate(['/company/edit', id]);
  }
}