import { Component, inject } from '@angular/core';
import { MoneyTableComponent } from '@haushaltsbuch/shared/ui-components';
import { Revenue, RevenueFacade } from '@haushaltsbuch/revenue/domain';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-revenue-table',
  imports: [MatProgressSpinnerModule, ReactiveFormsModule, MoneyTableComponent],
  templateUrl: './revenue-table.component.html',
})
export class RevenueTableComponent {
  private readonly facade = inject(RevenueFacade);

  revenue = this.facade.revenue;
  isLoading = this.facade.isLoading;
  isSaving = this.facade.isSaving;
  isAdded = this.facade.isAdded;

  constructor() {
    this.facade.loadRevenue();
  }

  addRevenue() {
    this.facade.addRevenue({ category: '', value: '0' });
  }

  updateRevenue(revenue: Revenue) {
    this.facade.updateRevenue(revenue);
  }

  deleteRevenue(id: number) {
    this.facade.deleteRevenue(id);
  }
}
