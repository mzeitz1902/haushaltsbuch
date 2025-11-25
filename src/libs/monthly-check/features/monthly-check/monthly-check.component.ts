import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { MonthlyCheckFacade } from '@haushaltsbuch/monthly-check/domain';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppHeaderComponent } from '@haushaltsbuch/shared/ui-components';
import dayjs from 'dayjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Field, form } from '@angular/forms/signals';
import { RevenueMonthTableComponent } from './revenue-month-table/revenue-month-table.component';

@Component({
  selector: 'app-monthly-check',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    NgSelectComponent,
    AppHeaderComponent,
    Field,
    RevenueMonthTableComponent,
  ],
  templateUrl: './monthly-check.component.html',
})
export class MonthlyCheckComponent {
  private readonly facade = inject(MonthlyCheckFacade);

  year = input<string>();
  month = input<string>();

  createdMonths = this.facade.createdMonths;
  createdYears = this.facade.createdYears;
  isLoaded = this.facade.isLoaded;

  formModel = linkedSignal<Form>(() => {
    let month = dayjs().format('YYYY-MM-DD');
    let year = this.year()!;

    if (this.year() && this.month()) {
      month = `${this.year()}-${this.month()}-01`;
    }
    if (!this.isMonthValid(month)) {
      month = null!;
    }
    if (year && !this.isYearValid(year)) {
      year = null!;
    }
    return {
      month,
      year,
    };
  });

  form = form(this.formModel);

  selectedMonth = computed(() => this.formModel().month);
  selectedYear = computed(() => this.formModel().year);

  readonly years = [dayjs().year()];

  // readonly months = Array.from({ length: 12 }, (_, i) => {
  //   const d = dayjs().month(i);
  //   return { label: d.format('MMMM'), value: d.format('MM') };
  // });
  // readonly years = [dayjs().year()];

  loadMonth = effect(() => {
    const month = this.selectedMonth();
    const year = this.selectedYear();
    if (month && year && this.isYearValid(year) && this.isMonthValid(month)) {
      this.facade.getMonth(month);
    }
  });

  navigateOnFormModelChange = effect(() => {
    const { month, year } = this.formModel();
    const _month = month ? dayjs(month).format('MM') : null;
    if (year && !month) {
      this.facade.navigateTo(year);
      return;
    }
    if (month) {
      this.facade.navigateTo(year, _month);
    }
  });

  constructor() {
    this.facade.getCreatedMonths();
  }

  createMonth() {
    const { month, year } = this.formModel();
    if (!month || !year) return;
    const dateString = `${year}-${month}-01`;
    this.facade.createMonth(dateString);
  }

  private isYearValid(year: string) {
    return this.createdYears().includes(year);
  }

  private isMonthValid(month: string) {
    return this.createdMonths()
      .map((m) => m.month)
      .includes(month);
  }
}

interface Form {
  month: string | null;
  year: string | null;
}
