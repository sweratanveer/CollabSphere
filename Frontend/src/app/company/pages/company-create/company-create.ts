import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CompanyService } from '../../services/company';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './company-create.html',
  styleUrl: './company-create.scss',
})
export class CompanyCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);
  private readonly router = inject(Router);

  // Signals
  readonly isLoading = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly companyForm: FormGroup = this.fb.group({
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
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const company: Company = this.companyForm.getRawValue();

    this.companyService.createCompany(company).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Company created successfully.');

        this.companyForm.reset({
          isActive: true,
        });

        setTimeout(() => {
          this.router.navigate(['/company']);
        }, 1200);
      },

      error: (error) => {
        this.isLoading.set(false);

        console.error(error);

        this.errorMessage.set(
          error?.error?.message ?? 'Unable to create company'
        );
      },
    });
  }

  resetForm(): void {
    this.submitted.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.companyForm.reset({
      isActive: true,
    });
  }
}