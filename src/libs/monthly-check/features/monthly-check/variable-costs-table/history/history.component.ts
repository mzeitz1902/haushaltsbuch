import {
  Component,
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

  selectedEntry = signal<string | null>(null);
  formModel = signal(this.initForm());

  form = form(this.formModel, (schema) => {
    debounce(schema.value, 500);
  });

  valueRef = viewChild<ElementRef>('value');

  updateEffect = effect(() => {
    const value = this.form.value().value();
    untracked(() => {
      const isDirty = this.form.value().dirty();
      console.log('isDirty', isDirty, 'value', value);
      if (isDirty && !!value) {
        this.update();
      }
    });
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

  resetForm() {
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
