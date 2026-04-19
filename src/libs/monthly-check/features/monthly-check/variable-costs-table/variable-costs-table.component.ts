import { Component, inject, input } from '@angular/core';
import {
  MonthlyCheckFacade,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { MoneyTableV2Component } from '@haushaltsbuch/shared/ui-components';

@Component({
  selector: 'app-variable-costs-table',
  imports: [LucideAngularModule, MoneyTableV2Component],
  providers: [DecimalPipe],
  templateUrl: './variable-costs-table.component.html',
})
export class VariableCostsTableComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  dataInput = input<VariableCost[]>(undefined, { alias: 'data' });
  totalInput = input<number>(undefined, { alias: 'total' });
  expanded = input(false);

  variableCosts = this.facade.variableCosts;
  totalVariableCosts = this.facade.totalVariableCosts;
  isLoading = this.facade.isMonthLoading;
  isSaving = this.facade.isSavingVariableCost;
  isAdded = this.facade.isVariableCostAdded;

  add() {
    this.facade.addVariableCost();
  }

  delete(id: number) {
    this.facade.deleteVariableCost(id);
  }

  update(cost: VariableCost) {
    this.facade.updateVariableCost(cost);
  }

  resetAddHistoryEntryProcessStatus() {
    this.facade.resetAddHistoryEntryProcessStatus();
  }
}
