import { Component, inject } from '@angular/core';
import { MoneyTableComponent } from '@haushaltsbuch/shared/ui-components';
import { FixedCost, FixedCostsFacade } from '@haushaltsbuch/fixed-costs/domain';

@Component({
  selector: 'app-special-costs',
  imports: [MoneyTableComponent],
  templateUrl: './special-costs.component.html',
  styles: ``,
})
export class SpecialCostsComponent {
  private readonly facade = inject(FixedCostsFacade);

  specialCosts = this.facade.specialCosts;
  total = this.facade.totalSpecialCosts;

  isLoading = this.facade.isLoading;
  isAdded = this.facade.isAdded;

  add() {
    this.facade.add({
      category: '',
      value: 0,
      due_in: 'Sonder',
      type: 'Fix',
    });
  }

  update(cost: FixedCost) {
    this.facade.update(cost);
  }

  delete(id: number) {
    this.facade.delete(id, 'Sonder');
  }
}
