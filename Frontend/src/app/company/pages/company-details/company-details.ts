import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CompanyService } from '../../services/company';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './company-details.html',
  styleUrls: ['./company-details.scss'],
})
export class CompanyDetailsComponent implements OnInit {
  private companyService = inject(CompanyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  company = signal<Company | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.getCompany(id);
    }
  }

  getCompany(id: string) {
    this.companyService.getCompany(id).subscribe({
      next: (response: Company) => {
        this.company.set({
          ...response,
          name: response.name ?? response.companyName,
          industry: response.industry ?? '',
          description: response.description ?? '',
        });
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  editCompany() {
    const c = this.company();
    if (c) {
      this.router.navigate(['/company/edit', c.id]);
    }
  }

  back() {
    this.router.navigate(['/company']);
  }
}
