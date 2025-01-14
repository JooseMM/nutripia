import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/button/button.component';

@Component({
  selector: 'nt-hero',
  imports: [ButtonComponent],
  templateUrl: './hero.component.html',
})
export class HeroComponent {}
