import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'nt-logo',
  imports: [NgClass],
  templateUrl: './logo.component.html',
})
export class LogoComponent {
  class = input<string>();
  customClasses = `text-charcoal tracking-wide font-bold flex ${this.class()}`;
}
