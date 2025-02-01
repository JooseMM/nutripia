import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';

type iconTypes = 'fish' | 'chicken' | 'banana' | 'apple' | 'brocoli';
@Component({
  selector: 'nt-decorative-icon',
  imports: [],
  templateUrl: './decorative-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecorativeIconComponent implements OnInit {
  type = input.required<iconTypes>();
  color = input.required<string>();
  increaseFactor = input<number>(1.3);
  scaleDimensions = {
    width: '',
    height: '',
  };

  ngOnInit(): void {
    this.scaleUp(this.type() === 'apple');
  }
  scaleUp(isAppleIcon: boolean) {
    const originalWidth = isAppleIcon ? 22 : 30;
    const originalHeight = isAppleIcon ? 26 : 22;
    const scaleWidth = originalWidth * this.increaseFactor();
    const aspectRation = originalWidth / originalHeight;

    this.scaleDimensions.width = `${scaleWidth}px`;
    this.scaleDimensions.height = `${scaleWidth / aspectRation}px`;
  }
}
