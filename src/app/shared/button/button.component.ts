import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'nt-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  isPrimaryStyle = input.required<boolean>();
  baseStyles = "font-bold cursor-pointer font-serif tracking-wide text-lg flex items-center border border-solid text-md px-8 py-2 rounded-full";
  primaryStyle = `${this.baseStyles} border border-solid border-dark-slate-grape bg-yellow border-dark-yellow`;

  label = input.required<string>();
  href = input.required<string>();
  routerLinkActive = input<string>("active");

}
