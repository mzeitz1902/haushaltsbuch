import { Component, input, output, TemplateRef } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CurrencyPipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Icon } from '@haushaltsbuch/shared/util-icons';
import { MoneyTableContentComponent } from './money-table-content/money-table-content.component';

@Component({
  selector: 'app-money-table-v2',
  imports: [
    MatCardContent,
    MatCard,
    CdkAccordionItem,
    CurrencyPipe,
    IconComponent,
    MatProgressSpinner,
    MoneyTableContentComponent,
  ],
  templateUrl: './money-table-v2.component.html',
})
export class MoneyTableV2Component<
  DATA extends {
    id: number | string;
    category: string | null;
    value: number | null;
  },
> {
  data = input.required<DATA[]>();
  isLoading = input.required<boolean>();
  isSaving = input.required<boolean>();
  isAdded = input.required<boolean>();
  total = input.required<number>();
  headerIcon = input.required<Icon>();

  headerTitle = input<string>();
  hasSum = input(true);
  col3Template = input<TemplateRef<unknown>>();
  useDataTemplate = input<'values' | 'valuesWithHistory'>('values');
  valuesWithHistoryKind = input<'budgets' | 'variableCosts'>();

  updateRow = output<DATA>();
  deleteRow = output<number>();
  addRow = output<void>();
}
