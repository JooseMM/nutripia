import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { ValidationError } from 'src/models/IValidationError';
import { NgClass } from '@angular/common';

@Component({
  selector: 'nt-custom-input',
  imports: [ReactiveFormsModule, NgClass, ButtonComponent],
  templateUrl: './custom-input.component.html',
})
export class CustomInputComponent {
  label = input.required<string>();
  type = input.required<string>();
  control = input.required<FormControl>();
  id = input.required<string>();
  validationErrorObject = input.required<ValidationError[]>();
  placeholder = input.required<string>();
  cdr = inject(ChangeDetectorRef);

  increaseNumber() {
    const currentValue: number = this.control().value;
    const currentYear = new Date().getFullYear();
    if (currentValue < currentYear) {
      this.control().setValue(currentValue + 1);
    }
  }
  decreaseNumber() {
    const currentValue: number = this.control().value;
    if (currentValue > 1900) {
      this.control().setValue(currentValue - 1);
      this.control().markAsDirty();
    }
  }
  isInputInvalid(): boolean {
    return this.control().invalid && this.control().touched;
  }
  showFirstValidationErrorMatch() {
    const errorObjectArray = this.validationErrorObject();
    /* iterate throught the validationErrorObject and try to match
     any error name with the one who exists in the control validation state
     */
    for (let i = 0; i < errorObjectArray.length; i++) {
      if (this.control().hasError(errorObjectArray[i].errorName)) {
        return errorObjectArray[i].output;
      }
    }
    return '';
  }
}
