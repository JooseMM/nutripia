import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';

@Component({
  selector: 'nt-home',
  imports: [HeroComponent],
  templateUrl: './home.component.html',
})
export class HomePage {

}
