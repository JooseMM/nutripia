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
  baseStyles = "font-bold text-lg border-solid text-md px-6 py-2 rounded-3xl"
  primaryStyle = this.baseStyles + " " + "border border-solid border-green"
  secundaryStyle = this.baseStyles + " " + "bg-green"
  label = input.required<string>();
  href = input.required<string>();
  routerLinkActive = input<string>("active");

}
