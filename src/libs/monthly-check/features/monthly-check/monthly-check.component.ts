import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  CreatedMonth,
  MonthlyCheckFacade,
} from '@haushaltsbuch/monthly-check/domain';
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

  formModel = signal<Form>({
    month: null!,
    year: null!,
  });

  readonly form = form(this.formModel);

  createdMonths = this.facade.createdMonths;
  createdYears = this.facade.createdYears;
  isLoaded = this.facade.isLoaded;

  month = computed(() => this.formModel().month);
  year = computed(() => this.formModel().year);

  readonly years = [dayjs().year()];

  // readonly months = Array.from({ length: 12 }, (_, i) => {
  //   const d = dayjs().month(i);
  //   return { label: d.format('MMMM'), value: d.format('MM') };
  // });
  // readonly years = [dayjs().year()];

  loadMonth = effect(() => {
    const month = this.month();
    const year = this.year();
    if (month && year) {
      this.facade.getMonth(month as unknown as string);
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
}

interface Form {
  month: CreatedMonth;
  year: number;
}
