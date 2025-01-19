import { Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { AboutComponent } from './sections/about/about.component';
import { WhyUsComponent } from './sections/why-us/why-us.component';

@Component({
  selector: 'nt-home',
  imports: [HeroComponent, WhyUsComponent, AboutComponent],
  templateUrl: './home.component.html',
})
export class HomePage {}
