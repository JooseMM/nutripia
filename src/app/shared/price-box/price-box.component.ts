import { NgClass, ViewportScroller } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { pricingInfo } from 'src/environments/environment';
import PricingPlanOptions from 'src/models/IPricingPlanOption';
import { CurrencyPipe } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { PricingType } from './utils';
import { navigateAndScrollTo } from 'src/app/constants/app-constants';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nt-price-box',
  imports: [NgClass, CurrencyPipe, ButtonComponent],
  templateUrl: './price-box.component.html',
})
export class PriceBoxComponent implements OnInit {
  router = inject(Router);
  scrollApi = inject(ViewportScroller);
  pricingPlanId = input.required<PricingType>();
  currentPricingPlan: PricingPlanOptions =
    pricingInfo.pricingPlanOptionsArray[0];
  /* we set the value of currentPricePlan base on the input of pricePlanId
   * and use the minimun plan as the default plan in the app */
  priceBaseStyleHeader = 'text-4xl font-bold';

  navigateAndScrollTo(url: string) {
    navigateAndScrollTo(url, '', this.router, this.scrollApi);
  }
  ngOnInit(): void {
    if (this.pricingPlanId() > 0)
      this.currentPricingPlan =
        pricingInfo.pricingPlanOptionsArray[this.pricingPlanId()];
  }
}
