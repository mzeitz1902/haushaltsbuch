import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  ButtonComponent,
  IconComponent,
} from '@haushaltsbuch/shared/ui-components';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CurrencyPipe } from '@angular/common';
import { HistoryComponent } from './history/history.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterCellDef,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MtxPopover, MtxPopoverTrigger } from '@ng-matero/extensions/popover';
import {
  HistoryEntry,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import { Field, form } from '@angular/forms/signals';

@Component({
  selector: 'app-money-with-history-table',
  imports: [
    ButtonComponent,
    CdkAccordionItem,
    CurrencyPipe,
    HistoryComponent,
    IconComponent,
    MatCard,
    MatCardContent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatTable,
    MtxPopover,
    MatFooterCellDef,
    MatHeaderCellDef,
    MtxPopoverTrigger,
    Field,
  ],
  templateUrl: './money-with-history-table.component.html',
})
export class MoneyWithHistoryTableComponent {
  title = input.required<string>();
  expanded = input.required<boolean>();
  showForecast = input.required<boolean>();
  data = input.required<VariableCost[]>();
  isLoading = input.required<boolean>();
  isSaving = input.required<boolean>();
  isAdded = input.required<boolean>();
  total = input.required<number>();

  updateRow = output<VariableCost>();
  deleteRow = output<number>();
  addRow = output<void>();
  addHistory = output<string>();
  updateHistory = output<{ rowId: string; entry: HistoryEntry }>();
  deleteHistory = output<{ rowId: string; historyId: string }>();

  selectedRow = signal<string | null>(null);
  selectedField = signal<'category' | 'forecast' | null>(null);

  formModel = signal<Form>(this.initForm());
  form = form(this.formModel);

  categoryRef = viewChild<ElementRef>('category');
  forecastRef = viewChild<ElementRef>('forecast');

  category = computed(() => this.formModel().category);
  forecast = computed(() => this.formModel().forecast);
  forecastTotal = computed(() => {
    return this.data().reduce((acc, cost) => acc + cost.forecast!, 0);
  });

  focusCategoryOnAdd = effect(() => {
    if (this.isAdded()) {
      untracked(() => {
        const newData = this.data().at(-1);
        this.editCategory(newData!);
        setTimeout(() =>
          this.categoryRef()?.nativeElement.scrollIntoView({
            behavior: 'smooth',
          })
        );
      });
    }
  });

  trackByFn(index: number, item: VariableCost) {
    return item?.id;
  }

  editCategory(row: VariableCost) {
    this.setForm(row);
    this.selectedRow.set(row.id);
    this.selectedField.set('category');
    setTimeout(() => this.categoryRef()?.nativeElement.select());
  }

  editForecast(row: VariableCost) {
    this.setForm(row);
    this.selectedRow.set(row.id);
    this.selectedField.set('forecast');
    setTimeout(() => this.forecastRef()?.nativeElement.select());
  }

  updateAndReset() {
    this.updateRow.emit(this.formModel() as VariableCost);
    this.selectedRow.set(null);
    this.selectedField.set(null);
    this.formModel.set(this.initForm());
  }

  onCategoryEnterPressed() {
    this.selectedField.set('forecast');
    setTimeout(() => this.forecastRef()?.nativeElement.select());
  }

  private initForm(): Form {
    return {
      id: null,
      category: null!,
      forecast: null!,
    };
  }

  private setForm(data: VariableCost) {
    this.formModel.set({
      id: data.id,
      category: data.category!,
      forecast: data.forecast!,
    });
  }

  displayedColumns = computed(() => {
    const columns = ['category', 'forecast', 'value', 'delete_button'];
    if (this.showForecast()) return columns;

    return columns.filter((col) => col !== 'forecast');
  });
}

interface Form {
  id: string | null;
  category: string;
  forecast: number;
}
