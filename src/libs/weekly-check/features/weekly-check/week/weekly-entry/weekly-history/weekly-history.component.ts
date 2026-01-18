import { Component, inject } from '@angular/core';
import { HistoryEntryDto } from '@haushaltsbuch/shared/sdks';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import { WeeklyCheckDataService } from '../../../../../domain/infrastructure/weekly-check.data.service';

@Component({
  selector: 'app-weekly-history',
  imports: [DatePipe, CurrencyPipe, ButtonComponent],
  templateUrl: './weekly-history.component.html',
  providers: [WeeklyCheckDataService],
})
export class WeeklyHistoryComponent {
  readonly data: { id: string; history: HistoryEntryDto[] } = inject(
    MAT_BOTTOM_SHEET_DATA
  );
  dataService = inject(WeeklyCheckDataService);

  deleteEntry(id: string) {
    return;
  }

  addEntry() {
    this.dataService.addHistoryEntry(+this.data.id, 'lidl').subscribe();
  }
}
