import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'nt-price-box',
  imports: [NgClass],
  templateUrl: './price-box.component.html',
})
export class PriceBoxComponent {
  months = input.required<number>();
  price = input.required<number>();
  pricePlanName = input.required<string>();
  isPreferred = input<boolean>(false);
}
