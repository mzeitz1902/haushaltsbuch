import { Component, inject, signal } from '@angular/core';
import {
  MonthlyCheckFacade,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import { MoneyWithHistoryTableComponent } from '../money-with-forecast-table/money-with-history-table.component';

@Component({
  selector: 'app-monthly-budgets-table',
  imports: [MoneyWithHistoryTableComponent],
  templateUrl: './monthly-budgets-table.component.html',
})
export class MonthlyBudgetsTableComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  budgets = this.facade.budgets;
  total = this.facade.totalBudgets;
  isLoading = this.facade.isMonthLoading;
  isSaving = this.facade.isSavingFixedCost;
  isAdded = signal(false); // todo

  add() {
    this.facade.addBudget();
  }

  delete(id: number) {
    this.facade.deleteVariableCost(id);
  }

  update(cost: VariableCost) {
    this.facade.updateVariableCost(cost);
  }
}
