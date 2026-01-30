import { Component, inject } from '@angular/core';
import {
  HistoryEntry,
  MonthlyCheckFacade,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import { MoneyWithHistoryTableComponent } from '../money-with-forecast-table/money-with-history-table.component';
import { MoneyTableV2Component } from '@haushaltsbuch/shared/ui-components';

@Component({
  selector: 'app-monthly-budgets-table',
  imports: [
    MoneyWithHistoryTableComponent,
    MoneyTableV2Component,
    // ButtonComponent,
    // CurrencyPipe,
    // NumberInputComponent,
    // StringInputComponent,
  ],
  templateUrl: './monthly-budgets-table.component.html',
})
export class MonthlyBudgetsTableComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  budgets = this.facade.budgets;
  total = this.facade.totalBudgets;
  isLoading = this.facade.isMonthLoading;
  isSaving = this.facade.isSavingFixedCost;
  isAdded = this.facade.isBudgetAdded;

  add() {
    this.facade.addBudget();
  }

  delete(id: number) {
    this.facade.deleteBudget(id);
  }

  update(cost: VariableCost) {
    this.facade.updateBudget(cost);
  }

  addHistory(budgetId: string) {
    this.facade.addBudgetHistoryEntry(budgetId);
  }

  deleteHistory({ rowId, historyId }: { rowId: string; historyId: string }) {
    this.facade.deleteBudgetHistoryEntry(rowId, historyId);
  }

  updateHistory({ rowId, entry }: { rowId: string; entry: HistoryEntry }) {
    this.facade.updateBudgetHistoryEntry(rowId, entry);
  }
}
