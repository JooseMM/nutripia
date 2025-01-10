import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonComponent } from './shared/button/button.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nutripia-app';
  protected isMenuOpen = false;
  protected isMobile = window.innerWidth < 1000;

  protected toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
