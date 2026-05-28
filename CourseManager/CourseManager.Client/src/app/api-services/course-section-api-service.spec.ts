import { TestBed } from '@angular/core/testing';

import { CourseSectionApiService } from './course-section-api-service';

describe('CourseSectionApiService', () => {
  let service: CourseSectionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseSectionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
