import { Component, inject, signal } from '@angular/core';
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
  styleUrl: './company-edit.scss',
})
export class CompanyEditComponent {

  private readonly fb = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly submitting = signal(false);

  readonly companyId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly companyForm: FormGroup = this.fb.group({
    companyName: ['', Validators.required],
    companyCode: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    website: [''],
    industry: [''],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    description: [''],
    logo: [''],
    isActive: [true],
  });

  constructor() {
    if (this.companyId) {
      this.loadCompany();
    }
  }

  loadCompany(): void {
    this.loading.set(true);

    this.companyService.getCompany(this.companyId).subscribe({
      next: (company: Company) => {
        this.companyForm.patchValue(company);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.loading.set(false);
      },
    });
  }

  updateCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.companyService
      .updateCompany(
        this.companyId,
        this.companyForm.getRawValue()
      )
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/company']);
        },
        error: (error) => {
          console.error(error);
          this.submitting.set(false);
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/company']);
  }

}