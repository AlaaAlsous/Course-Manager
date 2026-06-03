import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ParticipantDetail } from './participant-detail';

describe('ParticipantDetail', () => {
  let component: ParticipantDetail;
  let fixture: ComponentFixture<ParticipantDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantDetail],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
