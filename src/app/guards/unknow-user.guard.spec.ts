import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { unknowUserGuard } from './unknow-user.guard';

describe('unknowUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unknowUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
