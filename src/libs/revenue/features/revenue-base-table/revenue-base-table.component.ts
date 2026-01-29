import { Component, inject } from '@angular/core';
import { MoneyTableV2Component } from '@haushaltsbuch/shared/ui-components';
import { Revenue, RevenueFacade } from '@haushaltsbuch/revenue/domain';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-revenue-base-table',
  imports: [
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MoneyTableV2Component,
  ],
  templateUrl: './revenue-base-table.component.html',
})
export class RevenueBaseTableComponent {
  private readonly facade = inject(RevenueFacade);

  revenue = this.facade.revenue;
  total = this.facade.total;
  isLoading = this.facade.isLoading;
  isSaving = this.facade.isSaving;
  isAdded = this.facade.isAdded;

  constructor() {
    this.facade.loadRevenue();
  }

  addRevenue() {
    this.facade.addRevenue({ category: '', value: 0 });
  }

  updateRevenue(revenue: Revenue) {
    this.facade.updateRevenue(revenue);
  }

  deleteRevenue(id: number) {
    this.facade.deleteRevenue(id);
  }
}
