import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDetail } from './participant-detail';

describe('ParticipantDetail', () => {
  let component: ParticipantDetail;
  let fixture: ComponentFixture<ParticipantDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
