import { Component, inject } from '@angular/core';
import { AppHeaderComponent } from '@haushaltsbuch/shared/ui-components';
import { WeeklyCheckFacade } from '@haushaltsbuch/weekly-check/domain';
import { WeekComponent } from './week/week.component';
import { CdkAccordion } from '@angular/cdk/accordion';

@Component({
  selector: 'app-weekly-check',
  imports: [AppHeaderComponent, WeekComponent, CdkAccordion],
  templateUrl: './weekly-check.component.html',
})
export class WeeklyCheckComponent {
  private readonly facade = inject(WeeklyCheckFacade);

  weeklyChecks = this.facade.weeklyChecks;
  isLoading = this.facade.isLoading;

  constructor() {
    this.facade.loadWeeklyChecks();
  }
}
