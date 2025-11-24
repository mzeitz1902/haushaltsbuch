import { Component, inject } from '@angular/core';
import { MoneyTableComponent } from '@haushaltsbuch/shared/ui-components';
import {
  Revenue,
  RevenueFacade,
  UpdateRevenuePayload,
} from '@haushaltsbuch/revenue/domain';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-revenue-base-table',
  imports: [MatProgressSpinnerModule, ReactiveFormsModule, MoneyTableComponent],
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
    const payload = revenue as unknown as UpdateRevenuePayload;
    this.facade.updateRevenue(payload);
  }

  deleteRevenue(id: number) {
    this.facade.deleteRevenue(id);
  }
}
