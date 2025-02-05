import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
})
export class AppComponent {
  title = 'nutripia-app';
  protected isMenuOpen = false;
  ADMIN_ROLE = ADMIN_ROLE;
  CLIENT_ROLE = CLIENT_ROLE;
  NOT_AUTHENTICATED = NOT_AUTHENTICATED;

  protected toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  constructor() {
    registerLocaleData(localeEsCl, 'es-CL'); // register local data to angular internal system
  }
}
