import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CompanyService } from '../../services/company';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.scss'],
})
export class CompanyListComponent implements OnInit {

  private companyService = inject(CompanyService);
  private router = inject(Router);

  companies: Company[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.errorMessage = '';
    this.companyService.getCompanies().subscribe({
      next: (response) => {
        this.companies = response;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage =
          error?.error?.message ?? 'Unable to load company list';
        this.loading = false;
      },
    });
  }

  deleteCompany(id: string): void {

    if (!confirm('Delete this company?')) {
      return;
    }

    this.companyService.deleteCompany(id).subscribe({
      next: () => {
        this.loadCompanies();
      },
      error: (error) => {
        console.error(error);
      },
    });

  }

  viewCompany(id: string): void {
    this.router.navigate(['/company/details', id]);
  }

  editCompany(id: string): void {
    this.router.navigate(['/company/edit', id]);
  }

}
