import { Component, input } from '@angular/core';

@Component({
  selector: 'nt-subtitle',
  imports: [],
  templateUrl: './subtitle.component.html'
})
export class SubtitleComponent {
  title = input.required<string>();
}
