import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { computed, inject } from '@angular/core';

export const unknowUserGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthenticationService);
  const router = inject(Router);
  let currentUserRole = computed(() => service.getAuthenticationState().role);
  if (currentUserRole() === '') {
    return true;
  }
  router.navigate(['/']);
  return false;
};
