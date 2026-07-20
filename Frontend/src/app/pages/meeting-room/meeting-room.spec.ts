// This file contains unit tests for the MeetingRoomComponent.
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { MeetingRoomComponent } from './meeting-room';

describe('MeetingRoomComponent', () => {
  let component: MeetingRoomComponent;
  let fixture: ComponentFixture<MeetingRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingRoomComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'test-room' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingRoomComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});