import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[ntCloseMenuOnclick]'
})
export class CloseMenuOnclickDirective {

  @HostListener("click") onClick() {

  }
  constructor(private el: ElementRef) { }

}
