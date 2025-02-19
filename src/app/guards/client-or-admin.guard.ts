import { computed, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { ADMIN_ROLE, CLIENT_ROLE } from '../constants/app-constants';

export const clientOrAdminGuard: CanActivateFn = (_route, _state) => {
  const service = inject(AuthenticationService);
  let currentUserRole = computed(() => service.getAuthenticationState().role);
  if (currentUserRole() === ADMIN_ROLE || currentUserRole() === CLIENT_ROLE) {
    return true;
  }
  return false;
};
