import { Component, computed, inject, signal } from '@angular/core';
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

  weeks = this.facade.weeklyChecks;
  isLoading = this.facade.isLoading;

  formModel = signal<{ month: string }>({
    month: dayjs().format('MMMM'),
  });

  form = form(this.formModel);

  filteredWeeks = computed(() =>
    this.weeks().filter((week) => week.month === this.formModel().month)
  );

  constructor() {
    this.facade.loadWeeklyChecks();
  }

  readonly months = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().month(i);
    return d.format('MMMM');
  });
}
