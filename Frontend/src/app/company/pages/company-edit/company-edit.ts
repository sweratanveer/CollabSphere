import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CompanyService } from '../../services/company';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './company-edit.html',
  styleUrls: ['./company-edit.scss'],
})
export class CompanyEditComponent implements OnInit {

  companyForm!: FormGroup;

  companyId!: string;

  loading = false;

  submitting = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.companyId = this.route.snapshot.paramMap.get('id')!;

    this.initializeForm();

    this.loadCompany();

  }

  initializeForm(): void {

    this.companyForm = this.fb.group({

      name: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      phone: ['', Validators.required],

      website: [''],

      industry: ['', Validators.required],

      address: ['', Validators.required],

      city: ['', Validators.required],

      country: ['', Validators.required],

      description: [''],

    });

  }

  loadCompany(): void {

    this.loading = true;

    this.companyService.getCompany(this.companyId).subscribe({

      next: (company: Company) => {

        this.companyForm.patchValue({
          ...company,
          name: company.name ?? company.companyName,
        });

        this.loading = false;

      },

      error: (error: unknown) => {

        console.error(error);

        this.loading = false;

      },

    });

  }

  updateCompany(): void {

    if (this.companyForm.invalid) {

      this.companyForm.markAllAsTouched();

      return;

    }

    this.submitting = true;

    this.companyService
      .updateCompany(this.companyId, this.companyForm.value)
      .subscribe({

        next: () => {

          this.submitting = false;

          this.router.navigate(['/company']);

        },

        error: (error) => {

          console.error(error);

          this.submitting = false;

        },

      });

  }

  cancel(): void {

    this.router.navigate(['/company']);

  }

}