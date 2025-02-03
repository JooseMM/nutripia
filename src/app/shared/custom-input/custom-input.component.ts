import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'nt-custom-input',
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './custom-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent {
  label = input.required<string>();
  type = input.required<string>();
  control = input.required<FormControl>();
  controlName = input.required<string>();
  isInputValid = input.required<boolean>();
  validationErrorOutput = input.required<string>();

  increaseNumber() {
    const currentValue: number = this.control().value;
    if (currentValue < 99) {
      this.control().setValue(currentValue + 1);
    }
  }
  decreaseNumber() {
    const currentValue: number = this.control().value;
    if (currentValue > 1) {
      this.control().setValue(currentValue - 1);
    }
  }
}
