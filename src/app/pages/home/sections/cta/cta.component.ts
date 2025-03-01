import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { DecorativeIconComponent } from 'src/app/shared/decorative-icon/decorative-icon.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { navigateAndScrollTo } from 'src/app/constants/app-constants';

@Component({
  selector: 'nt-cta',
  imports: [ButtonComponent, DecorativeIconComponent],
  templateUrl: './cta.component.html',
})
export class CtaComponent {
  router = inject(Router);
  scrollApi = inject(ViewportScroller);
  routerSubscription = new Subscription();
  navigateAndScrollTo(url: string, router: Router) {
    navigateAndScrollTo(url, '', router, this.scrollApi);
  }
}
