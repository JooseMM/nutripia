import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { DecorativeIconComponent } from '../../../../shared/decorative-icon/decorative-icon.component';

@Component({
  selector: 'nt-cta',
  imports: [ButtonComponent, DecorativeIconComponent],
  templateUrl: './cta.component.html',
})
export class CtaComponent {}
