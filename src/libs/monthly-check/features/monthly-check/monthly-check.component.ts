import { Component, inject } from '@angular/core';
import { MonthlyCheckFacade } from '../../domain/application/monthly-check.facade';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import dayjs from 'dayjs';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-monthly-check',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    ButtonComponent,
    NgSelectComponent,
  ],
  templateUrl: './monthly-check.component.html',
})
export class MonthlyCheckComponent {
  private readonly facade = inject(MonthlyCheckFacade);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group<Form>({
    month: this.fb.control(dayjs().format('MM')),
    year: this.fb.control(dayjs().year()),
  });

  readonly months = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().month(i);
    return { label: d.format('MMMM'), value: d.format('MM') };
  });
  readonly years = [dayjs().year()];

  createMonth() {
    const { month, year } = this.form.getRawValue();
    if (!month || !year) return;
    const dateString = `${year}-${month}-01`;
    this.facade.createMonth(dateString);
  }
}

interface Form {
  month: FormControl<string>;
  year: FormControl<number>;
}
