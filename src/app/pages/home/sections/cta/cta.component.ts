import { Component, inject, OnDestroy } from '@angular/core';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { DecorativeIconComponent } from 'src/app/shared/decorative-icon/decorative-icon.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { navigateAndScrollTo } from 'src/app/constants/app-constants';

@Component({
  selector: 'nt-cta',
  imports: [ButtonComponent, DecorativeIconComponent],
  templateUrl: './cta.component.html',
})
export class CtaComponent implements OnDestroy {
  router = inject(Router);
  scrollApi = inject(ViewportScroller);
  routerSubscription = new Subscription();
  navigateAndScrollTo(url: string, subscription: Subscription, router: Router) {
    navigateAndScrollTo(
      url,
      '',
      this.routerSubscription,
      this.router,
      this.scrollApi,
    );
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
