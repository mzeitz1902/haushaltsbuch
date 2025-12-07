import { Component, inject, signal } from '@angular/core';
import {
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Field, form } from '@angular/forms/signals';
import dayjs from 'dayjs';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';

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

  formModel = signal<Form>({
    month: dayjs().format('MM'),
    year: dayjs().format('YYYY'),
  });

  form = form(this.formModel);

  years = [2025, 2026];

  months = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().month(i);
    return { label: d.format('MMMM'), value: d.format('MM') };
  });

  submitForm() {
    this.dialogRef.close(this.formModel());
  }
}

interface Form {
  month: string;
  year: string;
}
