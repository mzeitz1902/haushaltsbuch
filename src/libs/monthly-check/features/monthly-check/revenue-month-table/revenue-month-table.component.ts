import { Component, inject } from '@angular/core';
import { MoneyTableComponent } from '@haushaltsbuch/shared/ui-components';
import { MonthlyCheckFacade } from '@haushaltsbuch/monthly-check/domain';
import { Revenue } from '@haushaltsbuch/revenue/domain';

@Component({
  selector: 'app-revenue-month-table',
  imports: [MoneyTableComponent],
  templateUrl: './revenue-month-table.component.html',
})
export class RevenueMonthTableComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  revenue = this.facade.revenue;
  total = this.facade.totalRevenue;
  isLoading = this.facade.isLoading;
  isSaving = this.facade.isSaving;
  isAdded = this.facade.isRevenueAdded;

  addRevenue() {
    return;
  }

  updateRevenue(revenue: Revenue) {
    return;
  }

  deleteRevenue(id: number) {
    return;
  }
}
