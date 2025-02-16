import { TestBed } from '@angular/core/testing';

import { ResponseTrackerService } from './response-tracker.service';

describe('ResponseTrackerService', () => {
  let service: ResponseTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
