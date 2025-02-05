import { NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';

type stateOptions = 'loading' | 'idle';
@Component({
  selector: 'nt-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
})
export class ButtonComponent implements OnInit {
  isPrimary = input.required<boolean>();
  rounded = input<boolean>(true);
  href = input<string>('');
  routerLinkActive = input<string>('active');
  label = input.required<string>();
  type = input<string>('');
  isLoading = input<boolean>(false); // is waiting for the api response
  isDisabled = input<boolean>(false);
  class = input<string>(); //optional classes pass as an attribute in html
  baseStyles = '';
  primary = '';
  alternative = '';
  currentState: stateOptions = 'idle';

  ngOnInit(): void {
    this.baseStyles = `font-bold ${this.rounded() ? 'rounded-full' : 'rounded-md'} px-8 py-3 cursor-pointer text-center font-serif tracking-wide flex justify-center border border-solid text-md transition | lg:hover:opacity-60 `;
    this.primary = `${this.baseStyles} text-white border border-solid border-dark-slate-grape bg-primary-purple border-dark-slate-grape ${this.class()}`;
    this.alternative = `${this.baseStyles} text-charcoal border border-solid border-dark-slate-grape bg-white border-dark-yellow ${this.class()}`;
  }
}
