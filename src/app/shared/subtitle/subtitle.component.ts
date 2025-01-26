import { NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'nt-subtitle',
  imports: [NgClass],
  templateUrl: './subtitle.component.html',
})
export class SubtitleComponent implements OnInit {
  title = input.required<string>();
  class = input<string>();
  customClasses = '';

  ngOnInit(): void {
    this.customClasses = `flex space-x-6 items-center ${this.class()}`;
  }
}
