import { Component, inject, input } from '@angular/core';
import {
  MonthlyCheckFacade,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import { MoneyTableV2Component } from '@haushaltsbuch/shared/ui-components';

@Component({
  selector: 'app-monthly-budgets-table',
  imports: [MoneyTableV2Component],
  templateUrl: './monthly-budgets-table.component.html',
})
export class MonthlyBudgetsTableComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  dataInput = input<VariableCost[]>(undefined, { alias: 'data' });
  totalInput = input<number>(undefined, { alias: 'total' });
  expanded = input(false);

  data = this.facade.budgets;
  totalBudgets = this.facade.totalBudgets;
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

  resetAddHistoryEntryProcessStatus() {
    this.facade.resetAddHistoryEntryProcessStatus();
  }
}
