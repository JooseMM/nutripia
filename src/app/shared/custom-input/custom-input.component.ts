import { LowerCasePipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'nt-custom-input',
  imports: [ReactiveFormsModule, SlicePipe, UpperCasePipe, LowerCasePipe],
  templateUrl: './custom-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent {
  label = input.required<string>();
  type = input.required<string>();
  control = input.required<FormControl>();
  controlName = input.required<string>();
  isInputValid = input.required<boolean>();
}
