import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterCellDef,
  MatFooterRow,
  MatFooterRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { auditTime } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeNumberPipe } from '@haushaltsbuch/shared/util-pipes';

@Component({
  selector: 'app-money-table',
  imports: [
    ButtonComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatProgressSpinnerModule,
    MatRow,
    MatRowDef,
    MatTable,
    ReactiveFormsModule,
    MatFooterCellDef,
    NgTemplateOutlet,
    SafeNumberPipe,
  ],
  providers: [DecimalPipe, SafeNumberPipe],
  templateUrl: './money-table.component.html',
  host: {
    class: 'md:self-center md:w-2/3',
  },
})
export class MoneyTableComponent<
  DATA extends { id: number; category: string; value: string },
> {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly safeNumberPipe = inject(SafeNumberPipe);

  data = input.required<DATA[]>();
  isLoading = input.required<boolean>();
  isAdded = input.required<boolean>();

  customColumns = input<Column[]>([]);

  updateRow = output<DATA>();
  deleteRow = output<number>();

  category = viewChild<ElementRef>('category');
  value = viewChild<ElementRef>('value');

  selectedRow = signal<number | null>(null);
  selectedField = signal<'category' | 'value' | null>(null);

  total = computed(() =>
    this.data().reduce((acc, r) => {
      const value = Number(r.value);
      const isNumber = Number.isFinite(value);
      return acc + (isNumber ? value : 0);
    }, 0)
  );

  displayedColumns = computed(() =>
    ['category', 'value']
      .concat(this.customColumns().map((c) => c.name))
      .concat('delete_button')
  );

  focusCategoryOnAdd = effect(() => {
    if (this.isAdded()) {
      untracked(() => {
        const newData = this.data().at(-1);
        this.editCategory(newData!);
      });
    }
  });

  form = this.initForm();

  trackByFn(index: number, item: DATA) {
    return item?.id;
  }

  setForm(data: DATA) {
    this.form = this.fb.group<Form>({
      id: this.fb.control(data.id),
      category: this.fb.control(data.category),
      value: this.fb.control(this.safeNumberPipe.transform(data.value)!),
    });

    this.form.valueChanges.pipe(auditTime(500)).subscribe(() => {
      this.updateRow.emit(this.form.getRawValue() as DATA);
    });
  }

  editCategory(row: DATA) {
    this.setForm(row);
    this.selectedRow.set(row.id);
    this.selectedField.set('category');
    setTimeout(() => this.category()?.nativeElement.select());
  }

  editValue(row: DATA) {
    this.setForm(row);
    this.selectedRow.set(row.id);
    this.selectedField.set('value');
    setTimeout(() => this.value()?.nativeElement.select());
  }

  resetForm() {
    this.selectedRow.set(null);
    this.selectedField.set(null);
    this.form = this.initForm();
  }

  onCategoryEnterPressed() {
    this.selectedField.set('value');
    setTimeout(() => this.value()?.nativeElement.select());
  }

  private initForm() {
    return this.fb.group<Form>({
      id: this.fb.control(null!),
      category: this.fb.control(''),
      value: this.fb.control(''),
    });
  }
}

interface Form {
  id: FormControl<number>;
  category: FormControl<string>;
  value: FormControl<string>;
}

export interface Column {
  name: string;
  template: TemplateRef<unknown>;
}
