import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';

@Component({
  selector: 'nt-home',
  imports: [HeroComponent, AboutComponent],
  templateUrl: './home.component.html',
})
export class HomePage {

}
