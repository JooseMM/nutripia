import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ADMIN_ROLE } from 'src/app/constants/app-constants';
import { UserAdministrationService } from './components/user-administration/services/user-administration.service';
import User from 'src/models/IUser';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
import { ScheduleSidebarIconComponent } from './components/schedule-sidebar-icon/schedule-sidebar-icon.component';
import { UserAdministrationIconComponent } from './components/user-administration-icon/user-administration-icon.component';

@Component({
  selector: 'nt-administration',
  imports: [
    NgClass,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ScheduleSidebarIconComponent,
    UserAdministrationIconComponent,
  ],
  templateUrl: './administration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationComponent {
  authService = inject(AuthenticationService);
  userAdminService = inject(UserAdministrationService);
  routerService = inject(Router);
  isCurrentUserAdmin = computed(
    () => this.authService.getAuthenticationState().role === ADMIN_ROLE,
  );
  selectedStyles: string =
    'bg-primary-purple text-white border-b border-charcoal';
  unsaveChanges: Signal<boolean> = computed(
    () =>
      !!this.userAdminService
        .getAllUsers()
        .find((user: User) => user.markedForChange),
  );
  onRouterChange = toSignal(this.routerService.events);
  isScheduleRouteActive: Signal<boolean> = computed(() => {
    if (this.onRouterChange() instanceof NavigationEnd) {
      return (this.onRouterChange() as NavigationEnd).url.includes('agenda');
    } else {
      return false;
    }
  });

  saveChanges() {
    this.userAdminService.saveChanges();
  }
}
