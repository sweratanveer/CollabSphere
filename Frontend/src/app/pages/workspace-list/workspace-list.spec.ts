// This file contains unit tests for the WorkspaceListComponent.
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { WorkspaceListComponent } from './workspace-list';

describe('WorkspaceListComponent', () => {
  let component: WorkspaceListComponent;
  let fixture: ComponentFixture<WorkspaceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceListComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
