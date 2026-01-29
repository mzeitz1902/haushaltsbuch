import { Component, inject } from '@angular/core';
import { FixedCost, FixedCostsFacade } from '@haushaltsbuch/fixed-costs/domain';
import { MoneyTableV2Component } from '@haushaltsbuch/shared/ui-components';

@Component({
  selector: 'app-budgets',
  imports: [MoneyTableV2Component],
  templateUrl: './budgets.component.html',
})
export class BudgetsComponent {
  private readonly facade = inject(FixedCostsFacade);

  budgets = this.facade.budgets;
  total = this.facade.totalBudgets;
  isLoading = this.facade.isLoading;
  isSaving = this.facade.isSaving;
  isAdded = this.facade.isFixedAdded;

  add() {
    this.facade.add({
      category: 'Neu',
      value: 0,
      due_in: 'Alle',
      type: 'Budget',
    });
  }

  update(cost: FixedCost) {
    this.facade.update(cost);
  }

  delete(id: number) {
    this.facade.delete(id, 'Alle', 'Budget');
  }
}
