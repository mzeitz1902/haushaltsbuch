import { Component, inject } from '@angular/core';
import { HistoryEntryDto } from '@haushaltsbuch/shared/sdks';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CurrencyPipe } from '@angular/common';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import {
  WeeklyCheckFacade,
  WeeklyCheckShops,
} from '@haushaltsbuch/weekly-check/domain';

@Component({
  selector: 'app-weekly-history',
  imports: [CurrencyPipe, ButtonComponent],
  templateUrl: './weekly-history.component.html',
})
export class WeeklyHistoryComponent {
  private readonly facade = inject(WeeklyCheckFacade);

  readonly data: {
    id: string;
    history: HistoryEntryDto[];
    shop: keyof WeeklyCheckShops;
  } = inject(MAT_BOTTOM_SHEET_DATA);

  deleteEntry(id: string) {
    return id;
  }

  addEntry() {
    this.facade.addHistoryEntry(this.data.shop);
  }
}
