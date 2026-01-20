import { Component, inject } from '@angular/core';
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

  readonly data: WeeklyHistoryData = inject(MAT_BOTTOM_SHEET_DATA);

  history = this.facade.currentHistory;

  constructor() {
    this.facade.setCurrentHistoryInformation(
      this.data.weeklyCheckId,
      this.data.shop
    );
  }

  deleteEntry(id: string) {
    return id;
  }

  addEntry() {
    this.facade.addHistoryEntry();
  }
}

export interface WeeklyHistoryData {
  weeklyCheckId: number;
  shop: keyof WeeklyCheckShops;
}
