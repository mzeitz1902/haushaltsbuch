import { Component, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-string-input',
  imports: [],
  template: `
    <input
      #inputRef
      type="text"
      class="mb-1 w-24 rounded border-1 border-blue-400 bg-gray-600 p-1 outline-none"
      [value]="value()"
      (input)="value.set($event.target.value)"
      (blur)="blurred.emit()"
      (keyup.enter)="enterPress.emit()"
    />
  `,
})
export class StringInputComponent implements FormValueControl<
  string | undefined
> {
  value = model<string | undefined>();

  blurred = output();
  enterPress = output();
}
