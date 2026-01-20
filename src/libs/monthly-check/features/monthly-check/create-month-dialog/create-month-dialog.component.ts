import { Component, computed, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { form, FormField } from '@angular/forms/signals';
import dayjs from 'dayjs';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import { CreatedMonth } from '@haushaltsbuch/monthly-check/domain';

@Component({
  selector: 'app-create-month-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    NgSelectComponent,
    ButtonComponent,
    FormField,
  ],
  templateUrl: './create-month-dialog.component.html',
})
export class CreateMonthDialogComponent {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly data: DialogData = inject(MAT_DIALOG_DATA);

  formModel = signal<Form>({
    month: dayjs().add(1, 'month').format('MM'),
    year: dayjs().year(),
  });

  form = form(this.formModel);

  selectedYear = computed(() => this.formModel().year);

  months = computed(() => {
    // For the month dropdown, we need to only show months that have not yet been created for the selected year.
    // First, grab all created snapshots for the selected year
    const relevantMonths = this.createdSnapshots.filter(
      (snapshot) => snapshot.year() === this.selectedYear()
    );
    // Then, filter allMonths to only include months that are not in relevantMonths
    return this.allMonths.filter(
      (month) =>
        !relevantMonths.some(
          (created) => created.month() === month.date.month()
        )
    );
  });

  submitForm() {
    this.dialogRef.close(this.formModel());
  }

  // Array with all 12 months, give them German month names and their respective month number as value, while keeping a dayjs date object for comparison
  readonly allMonths = Array.from({ length: 12 }, (_, i) => {
    const date = dayjs().month(i);
    return { label: date.format('MMMM'), value: date.format('MM'), date };
  });

  readonly years = [2025, 2026];
  // Dayjs objects of created snapshots for comparison
  readonly createdSnapshots = this.data.createdMonths.map((month) =>
    dayjs(month.month)
  );
}

interface Form {
  month: string;
  year: number;
}

interface DialogData {
  createdMonths: CreatedMonth[];
}
