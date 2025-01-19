import { Component, input } from '@angular/core';

@Component({
  selector: 'nt-why-us-box',
  imports: [],
  templateUrl: './why-us-box.component.html',
})
export class WhyUsBoxComponent {
  imagePath = input.required();
  benefit = input.required();
  description = input.required();
}
