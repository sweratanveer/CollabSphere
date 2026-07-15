// This file contains unit tests for the WorkspaceDetailsComponent.
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { WorkspaceDetailsComponent } from './workspace-details';

describe('WorkspaceDetailsComponent', () => {
  let component: WorkspaceDetailsComponent;
  let fixture: ComponentFixture<WorkspaceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceDetailsComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'test-id' } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
