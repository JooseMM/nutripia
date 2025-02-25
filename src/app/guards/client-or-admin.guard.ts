import { computed, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { ADMIN_ROLE, CLIENT_ROLE } from '../constants/app-constants';

export const clientOrAdminGuard: CanActivateFn = (_route, _state) => {
  const service = inject(AuthenticationService);
  const route = inject(Router);
  let currentUserRole = computed(() => service.getAuthenticationState().role);
  if (currentUserRole() === ADMIN_ROLE || currentUserRole() === CLIENT_ROLE) {
    return true;
  }
  route.navigate(['/login']);
  return false;
};
