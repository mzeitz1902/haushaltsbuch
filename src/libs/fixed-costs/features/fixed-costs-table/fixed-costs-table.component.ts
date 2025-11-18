import {
  Component,
  computed,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  ButtonComponent,
  MoneyTableComponent,
} from '@haushaltsbuch/shared/ui-components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FixedCost, FixedCostsFacade } from '@haushaltsbuch/fixed-costs/domain';

@Component({
  selector: 'app-fixed-costs-table',
  imports: [ButtonComponent, MatProgressSpinnerModule, MoneyTableComponent],
  templateUrl: './fixed-costs-table.component.html',
})
export class FixedCostsTableComponent {
  private readonly facade = inject(FixedCostsFacade);

  fixedCosts = this.facade.fixedCosts;
  isLoading = this.facade.isLoading;
  isSaving = this.facade.isSaving;
  isAdded = this.facade.isAdded;

  dueInMonthsTmp = viewChild.required<TemplateRef<unknown>>('dueInMonths');

  additionalColumns = computed(() => [
    { name: 'due_in_month', template: this.dueInMonthsTmp() },
  ]);

  constructor() {
    this.facade.loadFixedCosts();
  }

  addFixedCost() {
    this.facade.addFixedCost({ category: '', value: '0', due_in: ['Alle'] });
  }

  updateFixedCost(fixedCost: FixedCost) {
    this.facade.updateFixedCost(fixedCost);
  }

  deleteFixedCost(id: number) {
    this.facade.deleteFixedCost(id);
  }
}
