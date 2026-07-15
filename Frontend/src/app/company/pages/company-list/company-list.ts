import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CompanyService } from '../../services/company';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './company-list.html',
  styleUrl: './company-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyListComponent {

  private readonly companyService = inject(CompanyService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly companies = signal<Company[]>([]);
  readonly loading = signal<boolean>(false);

  constructor() {
    this.loadCompanies();
  }

  loadCompanies(): void {

    this.loading.set(true);

    this.companyService
      .getCompanies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: (companies) => {

          this.companies.set(companies);

          this.loading.set(false);

        },

        error: (error) => {

          console.error('Failed to load companies:', error);

          this.loading.set(false);

        },

      });

  }

  deleteCompany(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to delete this company?'
    );

    if (!confirmed) {
      return;
    }

    this.companyService
      .deleteCompany(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: () => {

          this.loadCompanies();

        },

        error: (error) => {

          console.error('Failed to delete company:', error);

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