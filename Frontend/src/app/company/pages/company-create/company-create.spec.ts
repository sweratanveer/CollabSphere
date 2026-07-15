import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { CompanyCreateComponent } from './company-create';

describe('CompanyCreate', () => {
  let component: CompanyCreateComponent;
  let fixture: ComponentFixture<CompanyCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCreateComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
