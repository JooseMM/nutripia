import { Component } from '@angular/core';
import { PriceBoxComponent } from '../../../../shared/price-box/price-box.component';
import { SubtitleComponent } from '../../../../shared/subtitle/subtitle.component';

@Component({
  selector: 'nt-prices',
  imports: [PriceBoxComponent, SubtitleComponent],
  templateUrl: './prices.component.html',
})
export class PricesComponent {}
