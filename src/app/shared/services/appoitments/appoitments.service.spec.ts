import { TestBed } from '@angular/core/testing';

import { AppoitmentsService } from './appoitments.service';

describe('AppoitmentsService', () => {
  let service: AppoitmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppoitmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
