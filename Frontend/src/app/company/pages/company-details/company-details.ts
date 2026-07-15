import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CompanyService } from '../../services/company';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './company-details.html',
  styleUrls: ['./company-details.scss']
})
export class CompanyDetailsComponent implements OnInit {

  company!: Company;

  loading = true;

  constructor(
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.getCompany(id);
    }

  }

  getCompany(id: string) {

    this.companyService.getCompany(id).subscribe({

      next: (response: Company) => {

        this.company = {
          ...response,
          name: response.name ?? response.companyName,
          industry: response.industry ?? '',
          description: response.description ?? '',
        };

        this.loading = false;

      },

      error: (err: unknown) => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  editCompany() {

    this.router.navigate(['/company/edit', this.company.id]);

  }

  back() {

    this.router.navigate(['/company']);

  }

}