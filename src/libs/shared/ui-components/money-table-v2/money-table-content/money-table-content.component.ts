import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { NumberInputComponent } from '../editable-field/number-input/number-input.component';
import { StringInputComponent } from '../editable-field/string-input/string-input.component';
import { form, FormField } from '@angular/forms/signals';
import { HistoryEntry } from '@haushaltsbuch/monthly-check/domain';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HistoryComponent } from '../../../../monthly-check/features/monthly-check/money-with-forecast-table/history/history.component';

@Component({
  selector: 'app-money-table-content',
  imports: [
    ButtonComponent,
    CurrencyPipe,
    NumberInputComponent,
    StringInputComponent,
    FormField,
    NgTemplateOutlet,
  ],
  templateUrl: './money-table-content.component.html',
})
export class MoneyTableContentComponent<
  DATA extends {
    id: number | string;
    category: string | null;
    value: number | null;
    forecast?: number | null;
    history?: HistoryEntry[];
  },
> {
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly viewContainerRef = inject(ViewContainerRef);

  isExpanded = input.required<boolean>();
  data = input.required<DATA[]>();
  isLoading = input.required<boolean>();
  isSaving = input.required<boolean>();
  isAdded = input.required<boolean>();
  total = input.required<number>();

  hasSum = input(true);
  col3Template = input<TemplateRef<unknown>>();
  useDataTemplate = input<'values' | 'valuesWithHistory'>('values');
  headerTemplate = input<TemplateRef<unknown>>();

  updateRow = output<DATA>();
  deleteRow = output<number>();
  addRow = output<void>();

  categoryRef = viewChild<ElementRef>('category');
  valueRef = viewChild<ElementRef>('value');

  selectedRow = signal<number | string | null>(null);
  selectedField = signal<'category' | 'value' | 'forecast' | null>(null);

  formModel = signal<MoneyForm>(this.initForm());
  form = form(this.formModel);

  editCategory(row: DATA) {
    this.setForm(row);
    this.selectedRow.set(row.id);
    this.selectedField.set('category');
    setTimeout(() => this.categoryRef()?.nativeElement.select());
  }

  editValue(row: DATA) {
    this.setForm(row);
    this.selectedRow.set(row.id);
    this.bottomSheet.open(HistoryComponent, {
      data: { row },
      viewContainerRef: this.viewContainerRef,
    });
  }

  editForecast(row: DATA) {
    this.setForm(row);
    this.selectedRow.set(row.id);
    this.selectedField.set('forecast');
  }

  onCategoryEnterPressed() {
    this.selectedField.set('value');
    setTimeout(() => this.valueRef()?.nativeElement.select());
  }

  submitAndReset() {
    this.updateRow.emit(this.formModel() as DATA);
    this.selectedRow.set(null);
    this.selectedField.set(null);
    this.formModel.set(this.initForm());
  }

  private initForm(): MoneyForm {
    return {
      id: null,
      category: null!,
      value: null!,
      forecast: null,
    };
  }

  private setForm(data: DATA) {
    this.formModel.set({
      id: data.id,
      category: data.category!,
      value: data.value!,
      forecast: data.forecast ?? null,
    });
  }
}

interface MoneyForm {
  id: number | string | null;
  category: string;
  value: number;
  forecast: number | null;
}
