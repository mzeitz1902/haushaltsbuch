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
import {
  MonthlyCheckFacade,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import {
  ButtonComponent,
  IconComponent,
} from '@haushaltsbuch/shared/ui-components';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
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
import { debounce, Field, form } from '@angular/forms/signals';
import { MtxPopover, MtxPopoverTrigger } from '@ng-matero/extensions/popover';

@Component({
  selector: 'app-variable-costs-table',
  imports: [
    ButtonComponent,
    CdkAccordionItem,
    CurrencyPipe,
    IconComponent,
    LucideAngularModule,
    MatCard,
    MatCardContent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatTable,
    Field,
    MatFooterCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatHeaderCellDef,
    DatePipe,
    MtxPopover,
    MtxPopoverTrigger,
  ],
  providers: [DecimalPipe],
  templateUrl: './variable-costs-table.component.html',
})
export class VariableCostsTableComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  data = this.facade.variableCosts;
  total = this.facade.totalVariableCosts;
  isLoading = this.facade.isMonthLoading;
  isSaving = this.facade.isSavingVariableCost;
  isAdded = this.facade.isVariableCostAdded;

  selectedRow = signal<number | null>(null);
  selectedField = signal<'category' | 'forecast' | null>(null);

  formModel = signal<Form>(this.initForm());
  form = form(this.formModel, (schema) => {
    debounce(schema.forecast, 500);
    debounce(schema.category, 500);
  });
  categoryRef = viewChild<ElementRef>('category');
  forecastRef = viewChild<ElementRef>('forecast');

  category = computed(() => this.formModel().category);
  forecast = computed(() => this.formModel().forecast);

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

  updateEffect = effect(() => {
    const category = this.category();
    const forecast = this.forecast();
    untracked(() => {
      const isCategoryDirty = this.form.category().dirty();
      let isForecastDirty = false;
      if (forecast) {
        isForecastDirty = this.form.forecast().dirty();
      }
      if ((forecast && isForecastDirty) || (category && isCategoryDirty)) {
        this.update(this.formModel() as VariableCost);
        this.form().reset();
      }
    });
  });

  readonly displayedColumns = [
    'category',
    'forecast',
    'value',
    'delete_button',
  ];

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

  editValue(row: VariableCost) {
    // todo popover öffnen
    console.log('herpo');
    return;
  }

  resetForm() {
    this.selectedRow.set(null);
    this.selectedField.set(null);
    this.formModel.set(this.initForm());
  }

  onCategoryEnterPressed() {
    this.selectedField.set('forecast');
    setTimeout(() => this.forecastRef()?.nativeElement.select());
  }

  add() {
    this.facade.addVariableCost();
  }

  delete(id: number) {
    this.facade.deleteVariableCost(id);
  }

  update(cost: VariableCost) {
    this.facade.updateVariableCost(cost);
    this.selectedRow.set(null);
  }

  addHistoryEntry(row: VariableCost) {
    return;
  }

  removeHistoryEntry(row: VariableCost, id: number) {
    return;
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
}

interface Form {
  id: number | null;
  category: string;
  forecast: number;
}
