import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonComponent } from './shared/button/button.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCl from '@angular/common/locales/es-CL';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './app.component.html',
  providers: [{ provide: LOCALE_ID, useValue: 'es-CL' }],
})
export class AppComponent {
  title = 'nutripia-app';
  protected isMenuOpen = false;

  protected toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor() {
    registerLocaleData(localeEsCl, 'es-CL'); // register local data to angular internal system
  }
}
