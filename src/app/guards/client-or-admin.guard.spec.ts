import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { clientOrAdminGuard } from './clientOrAdminGuard';

describe('clientOrAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => clientOrAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
