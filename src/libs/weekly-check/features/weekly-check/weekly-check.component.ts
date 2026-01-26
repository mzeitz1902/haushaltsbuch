import {
  Component,
  computed,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
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
  host: {
    class: 'flex flex-col',
  },
})
export class WeeklyCheckComponent {
  private readonly facade = inject(WeeklyCheckFacade);

  weeks = this.facade.weeklyChecks;
  isLoading = this.facade.isLoading;

  private items = viewChildren(WeekComponent);

  state = signal<'closed' | 'open'>('closed');

  formModel = signal<{ month: Month }>({
    month: {
      label: dayjs().format('MMMM'),
      value: dayjs().format('YYYY-MM-01'),
    },
  });
  form = form(this.formModel);

  filteredWeeks = computed(() =>
    this.weeks().filter((week) => week.month === this.formModel().month.value)
  );

  constructor() {
    this.facade.loadWeeklyChecks();
  }

  compareWith(o1: { value: string }, o2: { value: string }) {
    return o1?.value === o2?.value;
  }

  expandAll() {
    this.items()?.forEach((item) => item.item().open());
    this.state.set('open');
  }

  collapseAll() {
    this.items()?.forEach((item) => item.item().close());
    this.state.set('closed');
  }

  readonly months: Month[] = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().month(i);
    return {
      label: d.format('MMMM'),
      value: d.format('YYYY-MM-01'),
    };
  });
}

interface Month {
  label: string; // e.g. Januar
  value: string; // e.g. 2026-01-01
}
