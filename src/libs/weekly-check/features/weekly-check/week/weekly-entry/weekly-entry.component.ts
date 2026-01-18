import { Component, inject, input, signal } from '@angular/core';
import { WeeklyCheckEntry } from '@haushaltsbuch/weekly-check/domain';
import { CurrencyPipe } from '@angular/common';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { WeeklyHistoryComponent } from './weekly-history/weekly-history.component';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-weekly-check-entry',
  imports: [CurrencyPipe],
  templateUrl: './weekly-entry.component.html',
})
export class WeeklyEntryComponent {
  private readonly bottomSheet = inject(MatBottomSheet);

  label = input.required<string>();
  entry = input.required<WeeklyCheckEntry>();

  isOpened = signal(false);

  openBottomSheet() {
    this.isOpened.set(true);
    this.bottomSheet
      .open(WeeklyHistoryComponent, {
        data: { id: this.entry().id, history: this.entry().history },
      })
      .afterDismissed()
      .pipe(
        take(1),
        tap(() => this.isOpened.set(false))
      )
      .subscribe();
  }
}
