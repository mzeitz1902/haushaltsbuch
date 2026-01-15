import { Component, inject } from '@angular/core';
import { AppHeaderComponent } from '@haushaltsbuch/shared/ui-components';
import { WeeklyCheckFacade } from '@haushaltsbuch/weekly-check/domain';

@Component({
  selector: 'app-weekly-check',
  imports: [AppHeaderComponent],
  templateUrl: './weekly-check.component.html',
})
export class WeeklyCheckComponent {
  private readonly facade = inject(WeeklyCheckFacade);

  constructor() {
    this.facade.loadWeeklyChecks();
  }
}
