import { inject, Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'safeNumber',
})
export class SafeNumberPipe implements PipeTransform {
  decimalPipe = inject(DecimalPipe);

  transform(value: string | number): string | null {
    const isNumber = Number.isFinite(+value);
    return isNumber ? this.decimalPipe.transform(value) : value.toString();
  }
}
