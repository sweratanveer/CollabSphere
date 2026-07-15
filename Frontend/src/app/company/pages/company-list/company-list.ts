import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CompanyService } from '../../services/company';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './company-list.html',
  styleUrl: './company-list.scss',
})
export class CompanyListComponent implements OnInit {
  private companyService = inject(CompanyService);
  private router = inject(Router);

  companies = signal<Company[]>([]);

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (response) => this.companies.set(response),
      error: (error) => console.error(error),
    });
  }

  deleteCompany(id: string): void {
    if (!confirm('Delete this company?')) {
      return;
    }

    this.companyService.deleteCompany(id).subscribe({
      next: () => this.loadCompanies(),
      error: (error) => console.error(error),
    });
  }

  viewCompany(id: string): void {
    this.router.navigate(['/company/details', id]);
  }

  editCompany(id: string): void {
    this.router.navigate(['/company/edit', id]);
  }
}
