import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ButtonComponent } from './shared/button/button.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData, ViewportScroller } from '@angular/common';
import localeEsCl from '@angular/common/locales/es-CL';
import { LogoComponent } from './shared/logo/logo.component';
import { AuthenticationService } from './shared/services/authentication/authentication.service';
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  navigateAndScrollTo,
  NOT_AUTHENTICATED,
} from './constants/app-constants';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonComponent,
    LogoComponent,
  ],
  templateUrl: './app.component.html',
  providers: [{ provide: LOCALE_ID, useValue: 'es-CL' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  scrollApi = inject(ViewportScroller);
  test = inject(AuthenticationService);
  authenticationService = inject(AuthenticationService);
  title = 'nutripia-app';
  protected isMenuOpen = false;
  ADMIN_ROLE = ADMIN_ROLE;
  CLIENT_ROLE = CLIENT_ROLE;
  NOT_AUTHENTICATED = NOT_AUTHENTICATED;
  currentUserRole: Signal<string> = computed(
    () => this.authenticationService.getAuthenticationState().role,
  );

  constructor() {
    registerLocaleData(localeEsCl, 'es-CL'); // register local data to angular internal system
  }
  protected toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  scrollTo(url: string, anchor: string) {
    this.toggleMenu();
    navigateAndScrollTo(url, anchor, this.router, this.scrollApi);
  }
  logout() {
    this.authenticationService.logout();
    this.toggleMenu();
  }
}
