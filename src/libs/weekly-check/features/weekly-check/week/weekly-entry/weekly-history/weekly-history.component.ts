import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import {
  WeeklyCheckFacade,
  WeeklyCheckShops,
  WeeklyHistoryForm,
} from '@haushaltsbuch/weekly-check/domain';
import { form, FormField, required } from '@angular/forms/signals';
import { HistoryEntryDto } from '@haushaltsbuch/shared/sdks';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-weekly-history',
  imports: [ButtonComponent, FormField, CurrencyPipe],
  templateUrl: './weekly-history.component.html',
})
export class WeeklyHistoryComponent {
  private readonly facade = inject(WeeklyCheckFacade);

  history = this.facade.currentHistory;

  readonly data: WeeklyHistoryData = inject(MAT_BOTTOM_SHEET_DATA);

  noteRef = viewChild.required<ElementRef>('noteInput');
  valueRef = viewChild.required<ElementRef>('valueInput');

  selectedEntry = signal<string | null>(null);
  formModel = signal<WeeklyHistoryForm>(this.initForm());
  form = form(this.formModel, (schemaPath) => {
    required(schemaPath.id);
    required(schemaPath.value);
    required(schemaPath.note);
  });

  constructor() {
    this.facade.setCurrentHistoryInformation(
      this.data.weeklyCheckId,
      this.data.shop
    );
  }

  deleteEntry(id: string) {
    return this.facade.deleteHistoryEntry(id);
  }

  addEntry() {
    this.facade.addHistoryEntry();
  }

  edit(entry: HistoryEntryDto, field: 'note' | 'value') {
    this.selectedEntry.set(entry.id);
    this.formModel.set({
      id: entry.id,
      value: entry.value,
      note: entry.note,
    });
    setTimeout(() => {
      switch (field) {
        case 'note':
          this.noteRef().nativeElement.select();
          break;
        case 'value':
          this.valueRef().nativeElement.select();
          break;
      }
    });
  }

  submitAndReset() {
    if (this.form().valid()) {
      this.facade.updateHistoryEntry(this.formModel());
      this.selectedEntry.set(null);
      this.formModel.set(this.initForm());
    }
  }

  private initForm(): WeeklyHistoryForm {
    return {
      id: null!,
      value: null!,
      note: null!,
    };
  }
}

export interface WeeklyHistoryData {
  weeklyCheckId: number;
  shop: keyof WeeklyCheckShops;
}
