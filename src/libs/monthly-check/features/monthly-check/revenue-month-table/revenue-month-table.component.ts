import { Component, inject, input } from '@angular/core';
import { MoneyTableV2Component } from '@haushaltsbuch/shared/ui-components';
import { MonthlyCheckFacade } from '@haushaltsbuch/monthly-check/domain';
import { Revenue } from '@haushaltsbuch/revenue/domain';

@Component({
  selector: 'app-revenue-month-table',
  imports: [MoneyTableV2Component],
  templateUrl: './revenue-month-table.component.html',
})
export class RevenueMonthTableComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  data = input<Revenue[]>();
  total = input<number>();
  expanded = input(false);

  revenue = this.facade.revenue;
  totalRevenue = this.facade.totalRevenue;
  isLoading = this.facade.isMonthLoading;
  isSaving = this.facade.isSavingRevenue;
  isAdded = this.facade.isRevenueAdded;

  addRevenue() {
    this.facade.addRevenue();
  }

  updateRevenue(revenue: Revenue) {
    this.facade.updateRevenue(revenue);
  }

  deleteRevenue(id: number) {
    this.facade.deleteRevenue(id);
  }
}
