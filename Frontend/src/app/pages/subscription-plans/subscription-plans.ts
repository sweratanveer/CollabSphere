// This file provides the subscription plans page: view plan catalog, create plans (Super Admin), and start Stripe checkout for a company, using signals.
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { SubscriptionService } from '../../services/subscription';
import { BillingService } from '../../services/billing';
import { CompanyService } from '../../company/services/company';
import { CreatePlanRequest } from '../../models/subscription.model';

interface CompanyOption {
  id: string;
  companyName: string;
}

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './subscription-plans.html',
  styleUrl: './subscription-plans.scss',
})
export class SubscriptionPlansComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private billingService = inject(BillingService);
  private companyService = inject(CompanyService);

  plans = this.subscriptionService.plans;
  loading = this.subscriptionService.loading;
  error = this.subscriptionService.error;

  companies = signal<CompanyOption[]>([]);
  selectedCompanyId = signal('');
  selectedPlanId = signal('');
  subscribeMessage = signal('');
  checkoutLoading = signal(false);

  showCreateForm = signal(false);
  planName = signal('');
  planPrice = signal(0);
  planMaxUsers = signal(5);
  planMaxWorkspaces = signal(3);
  planFeatures = signal('');
  creating = signal(false);
  createError = signal('');

  ngOnInit(): void {
    this.subscriptionService.loadPlans();

    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        const validCompanies: CompanyOption[] = companies
          .filter((c) => !!c.id)
          .map((c) => ({ id: c.id!, companyName: c.companyName }));

        this.companies.set(validCompanies);
      },
      error: () => {},
    });
  }

  subscribeCompany(): void {
    const companyId = this.selectedCompanyId();
    const planId = this.selectedPlanId();

    if (!companyId || !planId) {
      this.subscribeMessage.set('Please select both a company and a plan');
      return;
    }

    this.checkoutLoading.set(true);
    this.subscribeMessage.set('');

    this.billingService.startCheckout(companyId, planId).subscribe({
      next: (response) => {
        window.location.href = response.checkoutUrl;
      },
      error: (err: HttpErrorResponse) => {
        this.checkoutLoading.set(false);
        this.subscribeMessage.set(err?.error?.message || 'Failed to start checkout');
      },
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm.update((open) => !open);
  }

  createPlan(): void {
    if (!this.planName() || this.planPrice() < 0) {
      this.createError.set('Plan name and a valid price are required');
      return;
    }

    this.creating.set(true);
    this.createError.set('');

    const payload: CreatePlanRequest = {
      name: this.planName(),
      monthlyPrice: this.planPrice(),
      maxUsers: this.planMaxUsers(),
      maxWorkspaces: this.planMaxWorkspaces(),
      features: this.planFeatures()
        ? this.planFeatures().split(',').map((f) => f.trim())
        : undefined,
    };

    this.subscriptionService.createPlan(payload).subscribe({
      next: () => {
        this.creating.set(false);
        this.showCreateForm.set(false);
        this.planName.set('');
        this.planPrice.set(0);
        this.planFeatures.set('');
        this.subscriptionService.loadPlans();
      },
      error: (err: HttpErrorResponse) => {
        this.creating.set(false);
        this.createError.set(err?.error?.message || 'Failed to create plan');
      },
    });
  }

  deletePlan(id: string): void {
    const confirmed = confirm('Delete this plan?');

    if (!confirmed) {
      return;
    }

    this.subscriptionService.deletePlan(id);
  }
}