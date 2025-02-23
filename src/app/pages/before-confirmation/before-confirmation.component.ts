import { ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'nt-before-confirmation',
  imports: [],
  templateUrl: './before-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeforeConfirmationComponent implements OnInit {
  scrollApi = inject(ViewportScroller);
  ngOnInit(): void {
    this.scrollApi.scrollToPosition([0, 0]);
  }
}
