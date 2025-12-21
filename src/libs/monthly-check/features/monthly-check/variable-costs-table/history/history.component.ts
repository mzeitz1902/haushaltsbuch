import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  HistoryEntry,
  MonthlyCheckFacade,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import { debounce, Field, form } from '@angular/forms/signals';

@Component({
  selector: 'app-history',
  imports: [ButtonComponent, CurrencyPipe, DatePipe, Field],
  templateUrl: './history.component.html',
})
export class HistoryComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  row = input.required<VariableCost>();

  isAdded = this.facade.isHistoryEntryAdded;

  selectedEntry = signal<string | null>(null);
  formModel = signal(this.initForm());

  form = form(this.formModel, (schema) => {
    debounce(schema.value, 500);
  });

  valueRef = viewChild<ElementRef>('value');

  history = computed(() => this.row().history);

  focusValueOnAdd = effect(() => {
    if (this.isAdded()) {
      untracked(() => {
        if (this.history().length === 0) return;
        const newData = this.history().at(-1);
        this.editValue(newData!);
      });
    }
  });

  add() {
    this.facade.addHistoryEntry(this.row().id);
  }

  delete(id: string) {
    this.facade.deleteHistoryEntry(this.row().id, id);
  }

  update() {
    this.facade.updateHistoryEntry(this.row().id, this.form().value());
  }

  editValue(entry: HistoryEntry) {
    this.setForm(entry);
    this.selectedEntry.set(entry.id);
    setTimeout(() => this.valueRef()?.nativeElement.select());
  }

  submitAndReset() {
    this.update();
    this.selectedEntry.set(null);
    this.formModel.set(this.initForm());
  }

  private initForm(): Form {
    return {
      id: null!,
      value: null!,
      date: null!,
    };
  }

  private setForm(data: HistoryEntry) {
    this.formModel.set({
      id: data.id,
      value: data.value!,
      date: data.date!,
    });
  }
}

type Form = {
  [K in keyof HistoryEntry]: HistoryEntry[K];
};
