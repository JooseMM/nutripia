import { NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'nt-subtitle',
  imports: [NgClass],
  templateUrl: './subtitle.component.html',
})
export class SubtitleComponent {
  title = input.required<string>();
  class = input<string>();
}
