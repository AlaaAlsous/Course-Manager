import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonCreator } from './person-creator';

describe('PersonCreator', () => {
  let component: PersonCreator;
  let fixture: ComponentFixture<PersonCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonCreator],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonCreator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
