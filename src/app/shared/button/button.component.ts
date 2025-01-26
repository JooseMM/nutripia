import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'nt-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  isPrimary = input.required<boolean>();
  rounded = input<boolean>(true);
  label = input.required<string>();
  href = input.required<string>();
  routerLinkActive = input<string>('active');

  baseStyles = `font-bold text-white ${this.rounded() ? 'rounded-[1000px]' : ''} cursor-pointer font-serif tracking-wide text-lg flex items-center border border-solid text-md`;
  primary = `${this.baseStyles} px-8 py-3 border border-solid border-dark-slate-grape bg-primary-purple border-dark-slate-grape | lg:hover:bg-white lg:hover:text-charcoal transition`;
  alternative = `${this.baseStyles} border border-solid border-dark-slate-grape bg-yellow border-dark-yellow`;
}
