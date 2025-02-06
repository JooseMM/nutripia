import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ButtonComponent } from './shared/button/button.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCl from '@angular/common/locales/es-CL';
import { LogoComponent } from './shared/logo/logo.component';
import { AuthenticationService } from './shared/services/authentication/authentication.service';
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  NOT_AUTHENTICATED,
} from './constants/app-constants';
import { Subscription } from 'rxjs';

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
export class AppComponent implements OnInit, OnDestroy {
  title = 'nutripia-app';
  protected isMenuOpen = false;
  ADMIN_ROLE = ADMIN_ROLE;
  CLIENT_ROLE = CLIENT_ROLE;
  NOT_AUTHENTICATED = NOT_AUTHENTICATED;
  AuthenticationStateSubscription: Subscription = new Subscription();
  currentUserRole: string = '';
  authenticationService = inject(AuthenticationService);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);

  constructor() {
    registerLocaleData(localeEsCl, 'es-CL'); // register local data to angular internal system
  }
  protected toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  logout() {
    this.authenticationService.logout();
    this.toggleMenu();
    this.router.navigate(['/']);
  }
  ngOnInit(): void {
    this.AuthenticationStateSubscription =
      this.authenticationService.authenticationState$.subscribe({
        next: (newValue) => {
          this.cdr.markForCheck();
          this.currentUserRole = newValue.role;
        },
      });
  }
  ngOnDestroy(): void {
    this.AuthenticationStateSubscription.unsubscribe();
  }
}
