import { Component, inject } from '@angular/core';
import { FixedCostsFacade } from '@haushaltsbuch/fixed-costs/domain';
import { RevenueTableComponent } from '@haushaltsbuch/revenue/features';
import { AppHeaderComponent } from '@haushaltsbuch/shared/ui-components';
import { CdkAccordion } from '@angular/cdk/accordion';
import { FixedCostsTableComponent } from '@haushaltsbuch/fixed-costs/features';

@Component({
  selector: 'app-base',
  imports: [
    RevenueTableComponent,
    AppHeaderComponent,
    CdkAccordion,
    FixedCostsTableComponent,
  ],
  templateUrl: './base.component.html',
})
export class BaseComponent {
  private readonly fixedCostsFacade = inject(FixedCostsFacade);

  constructor() {
    this.fixedCostsFacade.loadFixedCosts();
  }
}
