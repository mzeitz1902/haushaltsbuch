import { Component, inject, signal } from '@angular/core';
import { AppHeaderComponent } from '@haushaltsbuch/shared/ui-components';
import { WeeklyCheckFacade } from '@haushaltsbuch/weekly-check/domain';
import { WeekComponent } from './week/week.component';
import { CdkAccordion } from '@angular/cdk/accordion';
import { NgSelectComponent } from '@ng-select/ng-select';
import dayjs from 'dayjs';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-weekly-check',
  imports: [
    AppHeaderComponent,
    WeekComponent,
    CdkAccordion,
    NgSelectComponent,
    FormField,
  ],
  templateUrl: './weekly-check.component.html',
})
export class WeeklyCheckComponent {
  private readonly facade = inject(WeeklyCheckFacade);

  weeklyChecks = this.facade.weeklyChecks;
  isLoading = this.facade.isLoading;

  formModel = signal<{ month: { label: string; value: string } }>({
    month: { label: dayjs().format('MM'), value: dayjs().format('YYYY-MM-DD') },
  });

  form = form(this.formModel);

  constructor() {
    this.facade.loadWeeklyChecks();
  }

  readonly months = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().month(i);
    return { label: d.format('MMMM'), value: d.format('YYYY-MM-DD') };
  });
}
