import {
  Component,
  effect,
  ElementRef,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
  selector: 'app-number-input',
  imports: [HlmInput],
  host: {
    class: 'block w-full',
  },
  template: `
    <input
      #inputRef
      hlmInput
      type="text"
      inputmode="decimal"
      class="w-full rounded-md border border-blue-400 bg-gray-600 text-right outline-none"
      [value]="inputValue()"
      (focus)="isEditing.set(true)"
      (input)="setValue($event.target.value)"
      (blur)="finishEditing()"
      (keyup.enter)="enterPress.emit()"
    />
  `,
})
export class NumberInputComponent implements FormValueControl<
  number | undefined | null
> {
  value = model<number | undefined | null>();
  inputValue = signal('');
  isEditing = signal(false);

  blurred = output();
  enterPress = output();

  inputRef = viewChild.required<ElementRef<HTMLInputElement>>('inputRef');

  constructor() {
    effect(() => {
      if (this.isEditing()) return;

      const value = this.value();
      this.inputValue.set(
        value === undefined || value === null ? '' : `${value}`
      );
    });
  }

  setValue(value: string | undefined): void {
    const inputValue = value ?? '';
    this.inputValue.set(inputValue);

    const normalizedValue = inputValue.trim().replaceAll(',', '.');
    if (!normalizedValue) {
      this.value.set(null);
      return;
    }

    const parsedValue = Number(normalizedValue);
    if (Number.isFinite(parsedValue)) {
      this.value.set(parsedValue);
    }
  }

  finishEditing() {
    this.isEditing.set(false);
    const value = this.value();
    this.inputValue.set(
      value === undefined || value === null ? '' : `${value}`
    );
    this.blurred.emit();
  }

  select() {
    setTimeout(() => {
      this.isEditing.set(true);
      this.inputRef().nativeElement.select();
    });
  }
}
