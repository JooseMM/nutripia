import { Component } from '@angular/core';
import { WhyUsBoxComponent } from 'src/app/shared/why-us-box/why-us-box.component';
import { SubtitleComponent } from '../../../../shared/subtitle/subtitle.component';

@Component({
  selector: 'nt-why-us',
  imports: [WhyUsBoxComponent, SubtitleComponent],
  templateUrl: './why-us.component.html',
})
export class WhyUsComponent {}
