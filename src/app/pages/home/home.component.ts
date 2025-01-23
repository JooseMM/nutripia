import { Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { AboutComponent } from './sections/about/about.component';
import { WhyUsComponent } from './sections/why-us/why-us.component';
import { PricesComponent } from './sections/prices/prices.component';

@Component({
  selector: 'nt-home',
  imports: [HeroComponent, WhyUsComponent, AboutComponent, PricesComponent],
  templateUrl: './home.component.html',
})
export class HomePage {}
