import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import { CurrencyPipe } from '@angular/common';
import {
  HistoryEntry,
  MonthlyCheckFacade,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import { form, FormField } from '@angular/forms/signals';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-history',
  imports: [ButtonComponent, CurrencyPipe, FormField],
  templateUrl: './history.component.html',
})
export class HistoryComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  readonly data: HistoryData = inject(MAT_BOTTOM_SHEET_DATA);

  isAdded = this.facade.isHistoryEntryAdded;
  isMonthLoaded = this.facade.isMonthLoaded;

  selectedEntry = signal<string | null>(null);
  formModel = signal(this.initForm());

  form = form(this.formModel);

  valueRef = viewChild<ElementRef>('value');
  noteRef = viewChild<ElementRef>('note');

  history = computed(() => this.data.row.history);

  focusValueOnAdd = effect(() => {
    if (this.isAdded() && this.isMonthLoaded()) {
      untracked(() => {
        const list = this.history();
        if (list.length === 0) return;

        const newest = list.at(-1)!;

        this.editValue(newest);
      });
    }
  });

  addHistory() {
    this.facade.addBudgetHistoryEntry(this.data.row.id);
  }

  deleteHistory(historyId: string) {
    this.facade.deleteBudgetHistoryEntry(this.data.row.id, historyId);
  }

  updateHistory({ rowId, entry }: { rowId: string; entry: HistoryEntry }) {
    this.facade.updateBudgetHistoryEntry(rowId, entry);
  }

  editValue(entry: HistoryEntry) {
    this.setForm(entry);
    this.selectedEntry.set(entry.id);
    setTimeout(() => this.valueRef()?.nativeElement.select());
  }

  editNote(entry: HistoryEntry) {
    this.setForm(entry);
    this.selectedEntry.set(entry.id);
    setTimeout(() => this.noteRef()?.nativeElement.select());
  }

  submitAndReset() {
    // this.updateHistory();
    this.selectedEntry.set(null);
    this.formModel.set(this.initForm());
  }

  private initForm(): Form {
    return {
      id: null!,
      value: null!,
      date: null!,
      note: '',
    };
  }

  private setForm(data: HistoryEntry) {
    this.formModel.set({
      id: data.id,
      value: data.value!,
      date: data.date!,
      note: data.note ?? '',
    });
  }
}

type Form = {
  [K in keyof HistoryEntry]: HistoryEntry[K];
};

export interface HistoryData {
  row: VariableCost;
}
