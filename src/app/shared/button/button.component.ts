import { NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';

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

  ngOnInit(): void {
    this.baseStyles = `font-bold ${this.rounded() ? 'rounded-full' : 'rounded-md'} px-8 py-3 cursor-pointer text-center font-serif tracking-wide text-lg flex justify-center border border-solid text-md transition`;
    this.primary = `${this.baseStyles} text-white border border-solid border-dark-slate-grape bg-primary-purple border-dark-slate-grape | lg:hover:border-charcoal lg:hover:text-charcoal lg:hover:bg-white | ${this.class()}`;
    this.alternative = `${this.baseStyles} text-charcoal border border-solid border-dark-slate-grape bg-white border-dark-yellow | lg:hover:border-white lg:hover:text-white lg:hover:bg-primary-purple ${this.class()}`;
  }
}
