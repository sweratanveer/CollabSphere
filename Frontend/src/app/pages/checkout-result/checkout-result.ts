// This file displays the outcome of a Stripe Checkout redirect (success or cancelled).
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-result',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout-result.html',
  styleUrl: './checkout-result.scss',
})
export class CheckoutResultComponent implements OnInit {
  private route = inject(ActivatedRoute);

  status = signal<'success' | 'cancelled' | 'unknown'>('unknown');

  ngOnInit(): void {
    const statusParam = this.route.snapshot.queryParamMap.get('status');

    if (statusParam === 'success' || statusParam === 'cancelled') {
      this.status.set(statusParam);
    }
  }
}