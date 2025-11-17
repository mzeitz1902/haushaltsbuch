import { Component, inject } from '@angular/core';
import { FixedCostsFacade } from '@haushaltsbuch/fixed-costs/domain';
import { RevenueTableComponent } from '@haushaltsbuch/revenue/features';
import { FixedCostsTableComponent } from '@haushaltsbuch/fixed-costs/features';
import { MatDivider } from '@angular/material/divider';
import { AppHeaderComponent } from '@haushaltsbuch/shared/ui-components';

@Component({
  selector: 'app-base',
  imports: [
    RevenueTableComponent,
    FixedCostsTableComponent,
    MatDivider,
    AppHeaderComponent,
  ],
  templateUrl: './base.component.html',
})
export class BaseComponent {
  private readonly fixedCostsFacade = inject(FixedCostsFacade);

  constructor() {
    this.fixedCostsFacade.loadFixedCosts();
  }
}
