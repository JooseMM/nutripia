import { NgClass } from '@angular/common';
import { Component, input, InputSignal, OnInit } from '@angular/core';

@Component({
  selector: 'nt-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent implements OnInit {
  isPrimary = input.required<boolean>();
  rounded = input<boolean>(true);
  type = input<string>('');
  disable = input<boolean>(false);
  optClasses = input<string>();
  label = input.required<string>();
  href = input<string>('');
  routerLinkActive = input<string>('active');
  baseStyles = '';
  primary = '';
  alternative = '';

  ngOnInit(): void {
    this.baseStyles = `font-bold ${this.rounded() ? 'rounded-full' : 'rounded-md'} px-8 py-3 cursor-pointer text-center font-serif tracking-wide text-lg flex justify-center border border-solid text-md transition ${this.optClasses()}`;
    this.primary = `${this.baseStyles} text-white border border-solid border-dark-slate-grape bg-primary-purple border-dark-slate-grape | lg:hover:bg-white lg:hover:text-charcoal `;
    this.alternative = `${this.baseStyles} text-charcoal border border-solid border-dark-slate-grape bg-white border-dark-yellow | lg:hover:border-white lg:hover:bg-primary-purple lg:hover:text-white`;
  }
}
