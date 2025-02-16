import { computed, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { CLIENT_ROLE } from '../constants/app-constants';

export const clientGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthenticationService);
  const router = inject(Router);
  let currentUserRole = computed(() => service.getAuthenticationState().role);
  if (currentUserRole() === CLIENT_ROLE) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
