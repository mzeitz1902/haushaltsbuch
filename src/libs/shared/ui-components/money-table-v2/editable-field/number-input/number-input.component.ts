import { Component, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-number-input',
  imports: [],
  template: `
    <input
      #inputRef
      type="number"
      class="mb-1 w-24 rounded border-1 border-blue-400 bg-gray-600 p-1 outline-none"
      [value]="value()"
      (input)="setValue($event.target.value)"
      (blur)="blurred.emit()"
      (keyup.enter)="enterPress.emit()"
    />
  `,
})
export class NumberInputComponent implements FormValueControl<
  number | undefined
> {
  value = model<number | undefined>();

  blurred = output();
  enterPress = output();

  setValue(value: string | undefined): void {
    if (!value) return;
    this.value.set(+value);
  }
}
