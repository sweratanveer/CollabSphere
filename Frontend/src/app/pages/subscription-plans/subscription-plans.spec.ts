// This file contains unit tests for the SubscriptionPlansComponent.
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { SubscriptionPlansComponent } from './subscription-plans';

describe('SubscriptionPlansComponent', () => {
  let component: SubscriptionPlansComponent;
  let fixture: ComponentFixture<SubscriptionPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPlansComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlansComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});