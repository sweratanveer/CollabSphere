import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private http = inject(HttpClient);

  private api = 'http://localhost:3000/companies';

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.api);
  }

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.api}/${id}`);
  }

  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.api, company);
  }

  updateCompany(id: string, company: Company): Observable<Company> {
    return this.http.patch<Company>(`${this.api}/${id}`, company);
  }

  deleteCompany(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
