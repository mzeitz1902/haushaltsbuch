import { Component, inject } from '@angular/core';
import { HistoryEntryDto } from '@haushaltsbuch/shared/sdks';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';

@Component({
  selector: 'app-weekly-history',
  imports: [DatePipe, CurrencyPipe, ButtonComponent],
  templateUrl: './weekly-history.component.html',
})
export class WeeklyHistoryComponent {
  readonly data: { history: HistoryEntryDto[] } = inject(MAT_BOTTOM_SHEET_DATA);

  deleteEntry(id: string) {
    return;
  }
}
