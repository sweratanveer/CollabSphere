import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CompanyService } from '../../services/company';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './company-create.html',
  styleUrl: './company-create.scss',
})
export class CompanyCreateComponent {

  private fb = inject(FormBuilder);

  private companyService = inject(CompanyService);

  private router = inject(Router);

  isLoading = false;

  submitted = false;

  errorMessage = '';

  successMessage = '';

  companyForm: FormGroup = this.fb.group({

    companyName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
      ],
    ],

    companyCode: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
      ],
    ],

    website: [''],

    address: [
      '',
      Validators.required,
    ],

    city: [
      '',
      Validators.required,
    ],

    country: [
      '',
      Validators.required,
    ],

    logo: [''],

    isActive: [true],

  });

  get f() {
    return this.companyForm.controls;
  }

  createCompany(): void {

    this.submitted = true;

    this.errorMessage = '';

    this.successMessage = '';

    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const company: Company = this.companyForm.value;

    this.companyService.createCompany(company).subscribe({

      next: () => {

        this.isLoading = false;

        this.successMessage =
          'Company created successfully.';

        this.companyForm.reset();

        this.companyForm.patchValue({
          isActive: true,
        });

        setTimeout(() => {

          this.router.navigate([
            '/company',
          ]);

        }, 1200);

      },

      error: (error) => {

        this.isLoading = false;

        console.error(error);

        this.errorMessage =
          error?.error?.message ??
          'Unable to create company';

      },

    });

  }

  resetForm(): void {

    this.submitted = false;

    this.errorMessage = '';

    this.successMessage = '';

    this.companyForm.reset();

    this.companyForm.patchValue({
      isActive: true,
    });

  }

}
