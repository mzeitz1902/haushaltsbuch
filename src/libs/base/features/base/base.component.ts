import { Component, computed, inject } from '@angular/core';
import { FixedCostsFacade } from '@haushaltsbuch/fixed-costs/domain';
import { RevenueTableComponent } from '@haushaltsbuch/revenue/features';
import {
  AppHeaderComponent,
  BalanceComponent,
} from '@haushaltsbuch/shared/ui-components';
import { CdkAccordion } from '@angular/cdk/accordion';
import {
  BudgetsComponent,
  FixedCostsTableComponent,
  QuarterlyCostsComponent,
  SpecialCostsComponent,
} from '@haushaltsbuch/fixed-costs/features';
import { RevenueFacade } from '@haushaltsbuch/revenue/domain';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-base',
  imports: [
    RevenueTableComponent,
    AppHeaderComponent,
    CdkAccordion,
    FixedCostsTableComponent,
    BalanceComponent,
    BudgetsComponent,
    QuarterlyCostsComponent,
    MatProgressSpinner,
    SpecialCostsComponent,
  ],
  templateUrl: './base.component.html',
})
export class BaseComponent {
  private readonly fixedCostsFacade = inject(FixedCostsFacade);
  private readonly revenueFacade = inject(RevenueFacade);

  balance = computed(
    () => this.revenueFacade.total() - this.fixedCostsFacade.totalFixedCosts()
  );

  isSavingCosts = this.fixedCostsFacade.isSaving;
}
