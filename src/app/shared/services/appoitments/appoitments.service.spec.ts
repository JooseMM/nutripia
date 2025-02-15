import { TestBed } from '@angular/core/testing';

import { AppoitmentService } from './appoitments.service';

describe('AppoitmentsService', () => {
  let service: AppoitmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppoitmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
