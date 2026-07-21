// This file defines the TypeScript interfaces for invoices and checkout requests.
export interface InvoiceCompanyRef {
  id: string;
  companyName: string;
}

export interface InvoicePlanRef {
  id: string;
  name: string;
  monthlyPrice: number;
}

export interface Invoice {
  id: string;
  company: InvoiceCompanyRef;
  plan: InvoicePlanRef;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
}