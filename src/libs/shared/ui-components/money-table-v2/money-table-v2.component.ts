import {
  Component,
  ElementRef,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Icon } from '@haushaltsbuch/shared/util-icons';
import { ButtonComponent } from '../button/button.component';
import { form, FormField } from '@angular/forms/signals';
import { StringInputComponent } from './editable-field/string-input/string-input.component';
import { NumberInputComponent } from './editable-field/number-input/number-input.component';

@Component({
  selector: 'app-money-table-v2',
  imports: [
    MatCardContent,
    MatCard,
    CdkAccordionItem,
    CurrencyPipe,
    IconComponent,
    MatProgressSpinner,
    ButtonComponent,
    StringInputComponent,
    FormField,
    NumberInputComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './money-table-v2.component.html',
})
export class MoneyTableV2Component<
  DATA extends { id: number; category: string | null; value: number | null },
> {
  data = input.required<DATA[]>();
  isLoading = input.required<boolean>();
  isSaving = input.required<boolean>();
  isAdded = input.required<boolean>();
  total = input.required<number>();
  headerIcon = input.required<Icon>();

  headerTitle = input<string>();
  col3Template = input<TemplateRef<unknown>>();

  updateRow = output<DATA>();
  deleteRow = output<number>();
  addRow = output<void>();

  categoryRef = viewChild<ElementRef>('category');
  valueRef = viewChild<ElementRef>('value');

  selectedRow = signal<number | null>(null);
  selectedField = signal<'category' | 'value' | null>(null);

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
    this.selectedField.set('value');
    setTimeout(() => this.valueRef()?.nativeElement.select());
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
    };
  }

  private setForm(data: DATA) {
    this.formModel.set({
      id: data.id,
      category: data.category!,
      value: data.value!,
    });
  }
}

export interface MoneyForm {
  id: number | null;
  category: string;
  value: number;
}
