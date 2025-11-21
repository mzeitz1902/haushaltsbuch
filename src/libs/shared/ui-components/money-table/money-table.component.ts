import {
  ChangeDetectionStrategy,
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
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { LucideAngularModule } from 'lucide-angular';
import { Icon } from '@haushaltsbuch/shared/util-icons';
import { MatCard, MatCardContent } from '@angular/material/card';

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
    CdkAccordionItem,
    LucideAngularModule,
    MatCard,
    MatCardContent,
    DecimalPipe,
  ],
  providers: [DecimalPipe, SafeNumberPipe],
  templateUrl: './money-table.component.html',
  host: {
    class: 'md:self-center md:w-2/3',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyTableComponent<
  DATA extends { id: number; category: string | null; value: number | null },
> {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly safeNumberPipe = inject(SafeNumberPipe);

  data = input.required<DATA[]>();
  isLoading = input.required<boolean>();
  isSaving = input.required<boolean>();
  isAdded = input.required<boolean>();

  customColumns = input<Column[]>([]);
  headerIcon = input<Icon>();
  headerTitle = input<string>();
  showAddButton = input<boolean>(true);

  updateRow = output<DATA>();
  deleteRow = output<number>();
  addRow = output<void>();

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
        setTimeout(() =>
          this.category()?.nativeElement.scrollIntoView({ behavior: 'smooth' })
        );
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
      value: this.fb.control(data.value!),
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
      value: this.fb.control(null!),
    });
  }
}

interface Form {
  id: FormControl<number>;
  category: FormControl<string | null>;
  value: FormControl<number | null>;
}

export interface Column {
  name: string;
  template: TemplateRef<unknown>;
}
