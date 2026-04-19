import { Component, inject, input } from '@angular/core';
import { MonthlyCheckFacade } from '@haushaltsbuch/monthly-check/domain';
import { MoneyTableV2Component } from '@haushaltsbuch/shared/ui-components';
import { FixedCost } from '@haushaltsbuch/fixed-costs/domain';

@Component({
  selector: 'app-fixed-costs-month-table',
  imports: [MoneyTableV2Component],
  templateUrl: './fixed-costs-month-table.component.html',
  styles: ``,
})
export class FixedCostsMonthTableComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  data = input<FixedCost[]>();
  total = input<number>();
  expanded = input(false);

  fixedCosts = this.facade.fixedCosts;
  totalFixedCosts = this.facade.totalFixedCosts;
  isLoading = this.facade.isMonthLoading;
  isSaving = this.facade.isSavingFixedCost;
  isAdded = this.facade.isFixedCostAdded;

  addFixedCost() {
    this.facade.addFixedCost();
  }

  updateFixedCost(fixedCost: FixedCost) {
    this.facade.updateFixedCost(fixedCost);
  }

  deleteFixedCost(id: number) {
    this.facade.deleteFixedCost(id);
  }
}
