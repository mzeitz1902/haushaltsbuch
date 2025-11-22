import { Component, inject } from '@angular/core';
import { MoneyTableComponent } from '@haushaltsbuch/shared/ui-components';
import { FixedCost, FixedCostsFacade } from '@haushaltsbuch/fixed-costs/domain';

@Component({
  selector: 'app-quarterly-costs',
  imports: [MoneyTableComponent],
  templateUrl: './quarterly-costs.component.html',
  styles: ``,
})
export class QuarterlyCostsComponent {
  private readonly facade = inject(FixedCostsFacade);

  quarterlyCosts = this.facade.quarterlyCosts;
  total = this.facade.totalQuarterlyCosts;

  isLoading = this.facade.isLoading;
  isAdded = this.facade.isAdded;

  add() {
    this.facade.add({
      category: '',
      value: 0,
      due_in: 'Quartal',
      type: 'Fix',
    });
  }

  update(cost: FixedCost) {
    this.facade.update(cost);
  }

  delete(id: number) {
    this.facade.delete(id, 'Quartal');
  }
}
