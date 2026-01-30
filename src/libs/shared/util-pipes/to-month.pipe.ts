import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'toMonth',
})
export class ToMonthPipe implements PipeTransform {
  transform(value: string[] | null): string | null {
    if (!value || value.length === 0) return null;

    return value.map((val) => dayjs(val).format('MMMM')).join(', ');
  }
}
