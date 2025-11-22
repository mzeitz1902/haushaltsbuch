import { Component, inject, viewChild } from '@angular/core';
import { MoneyTableComponent } from '@haushaltsbuch/shared/ui-components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FixedCost, FixedCostsFacade } from '@haushaltsbuch/fixed-costs/domain';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-fixed-costs-table',
  imports: [MatProgressSpinnerModule, MoneyTableComponent, ReactiveFormsModule],
  templateUrl: './fixed-costs-table.component.html',
})
export class FixedCostsTableComponent {
  private readonly facade = inject(FixedCostsFacade);

  fixedCosts = this.facade.fixedCosts;
  isLoading = this.facade.isLoading;
  isSaving = this.facade.isSaving;
  isAdded = this.facade.isAdded;
  total = this.facade.totalFixedCosts;

  selectTmpRef = viewChild<NgSelectComponent>(NgSelectComponent);

  constructor() {
    this.facade.loadFixedCosts();
  }

  addFixedCost() {
    this.facade.add({
      category: '',
      value: 0,
      due_in: 'Alle',
      type: 'Fix',
    });
  }

  updateFixedCost(fixedCost: FixedCost) {
    this.facade.update(fixedCost);
  }

  deleteFixedCost(id: number) {
    this.facade.delete(id, 'Alle');
  }
}
