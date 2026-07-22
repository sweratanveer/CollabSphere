import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private http = inject(HttpClient);

  private api = 'http://localhost:3000/companies';

  // Shared reactive state — jo bhi component ye signal read karega,
  // usay har jagah se hone wala change automatically mil jayega.
  companies = signal<Company[]>([]);

  fetchCompanies() {
    return this.http.get<Company[]>(this.api).pipe(
      tap((data) => this.companies.set(data)),
    );
  }

  getCompany(id: string) {
    return this.http.get<Company>(`${this.api}/${id}`);
  }

  createCompany(company: Company) {
    return this.http.post<Company>(this.api, company).pipe(
      tap((created) => this.companies.update((list) => [...list, created])),
    );
  }

  updateCompany(id: string, company: Company) {
    return this.http.patch<Company>(`${this.api}/${id}`, company).pipe(
      tap((updated) =>
        this.companies.update((list) =>
          list.map((c) => (c.id === id ? updated : c)),
        ),
      ),
    );
  }

  deleteCompany(id: string) {
    return this.http.delete(`${this.api}/${id}`).pipe(
      tap(() =>
        this.companies.update((list) => list.filter((c) => c.id !== id)),
      ),
    );
  }
}