import {
  Component,
  computed,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import {
  AppHeaderComponent,
  ButtonComponent,
} from '@haushaltsbuch/shared/ui-components';
import { WeeklyCheckFacade } from '@haushaltsbuch/weekly-check/domain';
import { WeekComponent } from './week/week.component';
import { CdkAccordion } from '@angular/cdk/accordion';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import dayjs from 'dayjs';
import { form, FormField } from '@angular/forms/signals';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-weekly-check',
  imports: [
    AppHeaderComponent,
    WeekComponent,
    CdkAccordion,
    NgSelectComponent,
    FormField,
    ButtonComponent,
    CurrencyPipe,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
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

  formModel = signal<{ month: string }>({
    month: dayjs().format('YYYY-MM-01'),
  });
  form = form(this.formModel);

  filteredWeeks = computed(() =>
    this.weeks().filter((week) => week.month === this.formModel().month)
  );

  totalBudget = computed(() => this.filteredWeeks().length * 250);
  totalSpent = computed(() =>
    this.filteredWeeks().reduce((sum, week) => sum + week.total, 0)
  );

  constructor() {
    this.facade.loadWeeklyChecks();
  }

  expandAll() {
    this.items()?.forEach((item) => item.item().open());
    this.state.set('open');
  }

  collapseAll() {
    this.items()?.forEach((item) => item.item().close());
    this.state.set('closed');
  }

  createWeek() {
    this.facade.createWeek();
  }

  readonly months: string[] = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().month(i);
    return d.format('YYYY-MM-01');
  });

  readonly format = dayjs;
}
