import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CompanyService } from '../../services/company';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './company-details.html',
  styleUrl: './company-details.scss',
})
export class CompanyDetailsComponent {

  private readonly companyService = inject(CompanyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly company = signal<Company | null>(null);
  readonly loading = signal(true);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.getCompany(id);
    } else {
      this.loading.set(false);
    }
  }

  getCompany(id: string): void {
    this.companyService.getCompany(id).subscribe({

      next: (response: Company) => {

        this.company.set({
          ...response,
          industry: response.industry ?? '',
          description: response.description ?? '',
        });

        this.loading.set(false);

      },

      error: (error: unknown) => {

        console.error(error);

        this.loading.set(false);

      },

    });
  }

  editCompany(): void {
    const company = this.company();

    if (company?.id) {
      this.router.navigate(['/company/edit', company.id]);
    }
  }

  back(): void {
    this.router.navigate(['/company']);
  }

}