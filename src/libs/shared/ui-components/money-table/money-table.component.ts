import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
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

  total = computed(() =>
    this.data().reduce((acc, r) => {
      const isNumber = Number.isFinite(+r.value);
      return acc + (isNumber ? +r.value : 0);
    }, 0)
  );

  displayedColumns = computed(() =>
    ['category', 'value', 'delete_button'].concat(
      this.customColumns().map((c) => c.name)
    )
  );

  focusCategoryOnAdd = effect(() => {
    if (this.isAdded()) {
      untracked(() => {
        const newData = this.data().at(-1);
        this.setForm(newData!);
        this.focusCategory();
      });
    }
  });

  form = this.fb.group<Form>({
    id: this.fb.control(null!),
    category: this.fb.control(''),
    value: this.fb.control(''),
  });

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

  focusCategory() {
    setTimeout(() => this.category()?.nativeElement.select());
  }

  focusValue() {
    setTimeout(() => this.value()?.nativeElement.select());
  }
}

interface Form {
  id: FormControl<number>;
  category: FormControl<string>;
  value: FormControl<string>;
}

interface Column {
  name: string;
  template: TemplateRef<unknown>;
}
