import { Component, inject, signal } from '@angular/core';
import { MonthlyCheckFacade } from '../../domain/application/monthly-check.facade';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AppHeaderComponent,
  ButtonComponent,
} from '@haushaltsbuch/shared/ui-components';
import dayjs from 'dayjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Field, form } from '@angular/forms/signals';

@Component({
  selector: 'app-monthly-check',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    ButtonComponent,
    NgSelectComponent,
    AppHeaderComponent,
    Field,
  ],
  templateUrl: './monthly-check.component.html',
})
export class MonthlyCheckComponent {
  private readonly facade = inject(MonthlyCheckFacade);
  private readonly fb = inject(NonNullableFormBuilder);

  formModel = signal<Form>({
    month: dayjs().format('MM'),
    year: dayjs().year(),
  });

  readonly form = form(this.formModel);

  readonly months = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().month(i);
    return { label: d.format('MMMM'), value: d.format('MM') };
  });
  readonly years = [dayjs().year()];

  createMonth() {
    const { month, year } = this.formModel();
    if (!month || !year) return;
    const dateString = `${year}-${month}-01`;
    this.facade.createMonth(dateString);
  }
}

interface Form {
  month: string;
  year: number;
}
