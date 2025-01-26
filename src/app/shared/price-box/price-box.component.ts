import { NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import PricingPlanOptions from 'src/models/IPricingPlanOption';
import { CurrencyPipe } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'nt-price-box',
  imports: [NgClass, CurrencyPipe, ButtonComponent],
  templateUrl: './price-box.component.html',
})
export class PriceBoxComponent implements OnInit {
  pricingPlanId = input.required<0 | 1 | 2>();
  currentPricingPlan: PricingPlanOptions =
    environment.pricingPlanOptionsArray[0];
  /* we set the value of currentPricePlan base on the input of pricePlanId
   * and use the minimun plan as the default plan in the app */
  priceBaseStyleHeader = 'text-4xl font-bold';
  ngOnInit(): void {
    if (this.pricingPlanId() > 0)
      this.currentPricingPlan =
        environment.pricingPlanOptionsArray[this.pricingPlanId()];
  }
}
