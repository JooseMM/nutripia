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
  baseStyles = "font-bold cursor-pointer text-white text-lg flex items-center tracking-wider border border-solid text-md px-8 py-2 rounded-full";
  primaryStyle = `${this.baseStyles} border border-solid border-green bg-yellow border-dark-yellow`;
  secundaryStyle = `${this.baseStyles} bg-light-green lg:hover:bg-green border-dark-green`;

  label = input.required<string>();
  href = input.required<string>();
  routerLinkActive = input<string>("active");

}
