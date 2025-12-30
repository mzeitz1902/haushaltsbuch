import { Component, inject } from '@angular/core';
import {
  MonthlyCheckFacade,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { MoneyWithHistoryTableComponent } from '../money-with-forecast-table/money-with-history-table.component';

@Component({
  selector: 'app-variable-costs-table',
  imports: [LucideAngularModule, MoneyWithHistoryTableComponent],
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

  add() {
    this.facade.addVariableCost();
  }

  delete(id: number) {
    this.facade.deleteVariableCost(id);
  }

  update(cost: VariableCost) {
    this.facade.updateVariableCost(cost);
  }
}
