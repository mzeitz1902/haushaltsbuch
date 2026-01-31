import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChildren,
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
  selector: 'app-monthly-history',
  imports: [ButtonComponent, CurrencyPipe, FormField],
  templateUrl: './monthly-history.component.html',
})
export class MonthlyHistoryComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  readonly data: HistoryData = inject(MAT_BOTTOM_SHEET_DATA);

  isAdded = this.facade.isHistoryEntryAdded;
  isMonthLoaded = this.facade.isMonthLoaded;

  selectedEntry = signal<string | null>(null);
  formModel = signal(this.initForm());

  form = form(this.formModel);

  valueInputs = viewChildren<ElementRef>('valueInput');
  noteInputs = viewChildren<ElementRef<HTMLInputElement>>('noteInput');

  currentHistory = computed(() => {
    switch (this.data.kind) {
      case 'budgets':
        return this.facade
          .budgets()
          .find((budget) => budget.id === this.data.row.id)!.history;
      case 'variableCosts':
        return this.facade
          .variableCosts()
          .find((entry) => entry.id === this.data.row.id)!.history;
      default:
        throw new Error(`History not found for ${this.data.kind}`);
    }
  });

  focusValueOnAdd = effect(() => {
    if (this.isAdded() && this.isMonthLoaded()) {
      untracked(() => {
        const list = this.currentHistory();
        if (list.length === 0) return;

        const newest = list.at(-1)!;

        this.edit(newest, 'value');
      });
    }
  });

  addHistory() {
    switch (this.data.kind) {
      case 'budgets':
        this.facade.addBudgetHistoryEntry(this.data.row.id);
        break;
      case 'variableCosts':
        this.facade.addVariableCostHistoryEntry(this.data.row.id);
        break;
      default:
        throw new Error(`History not found for ${this.data.kind}`);
    }
  }

  deleteHistory(historyId: string) {
    switch (this.data.kind) {
      case 'budgets':
        this.facade.deleteBudgetHistoryEntry(this.data.row.id, historyId);
        break;
      case 'variableCosts':
        this.facade.deleteVariableCostHistoryEntry(this.data.row.id, historyId);
        break;
      default:
        throw new Error(`History not found for ${this.data.kind}`);
    }
    this.facade.deleteBudgetHistoryEntry(this.data.row.id, historyId);
  }

  updateHistory(payload: Form) {
    switch (this.data.kind) {
      case 'budgets':
        this.facade.updateBudgetHistoryEntry(this.data.row.id, payload);
        break;
      case 'variableCosts':
        this.facade.updateVariableCostHistoryEntry(this.data.row.id, payload);
        break;
      default:
        throw new Error(`History not found for ${this.data.kind}`);
    }
  }

  edit(entry: HistoryEntry, field: 'note' | 'value') {
    this.selectedEntry.set(entry.id);
    this.setForm(entry);

    // Give the DOM time to render the inputs, then select the matching one
    setTimeout(() => {
      const selectedId = this.selectedEntry();
      if (!selectedId) return;

      switch (field) {
        case 'note': {
          const el = this.noteInputs().find(
            (ref) => ref.nativeElement.dataset['id'] === selectedId
          )!.nativeElement;
          el.select();
          break;
        }
        case 'value': {
          const el = this.valueInputs().find(
            (ref) => ref.nativeElement.dataset['id'] === selectedId
          )!.nativeElement;
          el.select();
          break;
        }
      }
    });
  }

  submitAndReset() {
    this.updateHistory(this.form().value());
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
  kind: 'budgets' | 'variableCosts';
}
