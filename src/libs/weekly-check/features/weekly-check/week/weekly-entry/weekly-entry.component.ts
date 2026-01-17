import { Component, input } from '@angular/core';
import { WeeklyCheckEntry } from '@haushaltsbuch/weekly-check/domain';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-weekly-check-entry',
  imports: [CurrencyPipe],
  templateUrl: './weekly-entry.component.html',
  styles: ``,
})
export class WeeklyEntryComponent {
  label = input.required<string>();
  entry = input.required<WeeklyCheckEntry>();
}
