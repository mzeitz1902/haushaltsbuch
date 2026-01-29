import { Component, inject } from '@angular/core';
import { MoneyTableV2Component } from '@haushaltsbuch/shared/ui-components';
import { FixedCost, FixedCostsFacade } from '@haushaltsbuch/fixed-costs/domain';

@Component({
  selector: 'app-quarterly-costs',
  imports: [MoneyTableV2Component],
  templateUrl: './quarterly-costs.component.html',
  styles: ``,
})
export class QuarterlyCostsComponent {
  private readonly facade = inject(FixedCostsFacade);

  quarterlyCosts = this.facade.quarterlyCosts;
  total = this.facade.totalQuarterlyCosts;

  isLoading = this.facade.isLoading;
  isAdded = this.facade.isQuarterlyAdded;

  add() {
    this.facade.add({
      category: 'Neu',
      value: 0,
      due_in: 'Quartal',
      type: 'Fix',
    });
  }

  update(cost: FixedCost) {
    this.facade.update(cost);
  }

  delete(id: number) {
    this.facade.delete(id, 'Quartal', 'Fix');
  }
}
