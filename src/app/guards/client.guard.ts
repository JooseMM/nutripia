import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { CLIENT_ROLE } from '../constants/app-constants';

export const clientGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthenticationService);
  const router = inject(Router);
  let currentUserRole = '';
  service.authenticationState$.subscribe({
    next: (authState) => {
      currentUserRole = authState.role;
    },
  });
  if (currentUserRole === CLIENT_ROLE) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
