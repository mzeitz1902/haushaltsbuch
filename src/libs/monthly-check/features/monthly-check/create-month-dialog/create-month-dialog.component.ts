import { Component, computed, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Field, form } from '@angular/forms/signals';
import dayjs from 'dayjs';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import { CreatedMonth } from '@haushaltsbuch/monthly-check/domain';

@Component({
  selector: 'app-create-month-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    NgSelectComponent,
    Field,
    ButtonComponent,
  ],
  templateUrl: './create-month-dialog.component.html',
})
export class CreateMonthDialogComponent {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly data: DialogData = inject(MAT_DIALOG_DATA);

  formModel = signal<Form>({
    month: dayjs().format('MM'),
    year: dayjs().format('YYYY'),
  });

  form = form(this.formModel);

  years = [2025, 2026];

  createdMonths = this.data.createdMonths.map((month) => dayjs(month.month));

  months = computed(() => {
    // First, we create an array with all 12 months, give them German month names and their respective month number as value, while keeping a dayjs date object for comparison
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const date = dayjs().month(i);
      return { label: date.format('MMMM'), value: date.format('MM'), date };
    });
    // Then, we filter out all months that are already created in the selected year
    return allMonths.filter(
      (element) =>
        !this.createdMonths.some(
          (cm) =>
            cm.year() === element.date.year() &&
            cm.month() === element.date.month()
        )
    );
  });

  submitForm() {
    this.dialogRef.close(this.formModel());
  }
}

interface Form {
  month: string;
  year: string;
}

interface DialogData {
  createdMonths: CreatedMonth[];
}
