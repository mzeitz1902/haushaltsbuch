import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import {
  CurrencyPipe,
  DecimalPipe,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
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
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { LucideAngularModule } from 'lucide-angular';
import { Icon } from '@haushaltsbuch/shared/util-icons';
import { MatCard, MatCardContent } from '@angular/material/card';
import { IconComponent } from '../icon/icon.component';
import { MatTooltip } from '@angular/material/tooltip';
import { debounce, Field, form } from '@angular/forms/signals';

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
    CurrencyPipe,
    IconComponent,
    MatTooltip,
    Field,
    NgClass,
  ],
  providers: [DecimalPipe],
  templateUrl: './money-table.component.html',
  host: {
    class: 'md:self-center md:w-2/3',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyTableComponent<
  DATA extends { id: number; category: string | null; value: number | null },
> {
  data = input.required<DATA[]>();
  isLoading = input.required<boolean>();
  isSaving = input.required<boolean>();
  isAdded = input.required<boolean>();
  total = input.required<number>();
  headerIcon = input.required<Icon>();

  customColumns = input<Column[]>([]);

  headerTitle = input<string>();

  updateRow = output<DATA>();
  deleteRow = output<number>();
  addRow = output<void>();

  categoryRef = viewChild<ElementRef>('category');
  valueRef = viewChild<ElementRef>('value');

  selectedRow = signal<number | null>(null);
  selectedField = signal<'category' | 'value' | null>(null);

  formModel = signal<Form>(this.initForm());
  category = computed(() => this.formModel().category);
  value = computed(() => this.formModel().value);

  displayedColumns = computed(() =>
    ['category', 'value']
      .concat(this.customColumns().map((c) => c.name))
      .concat('delete_button')
  );

  form = form(this.formModel, (schema) => {
    debounce(schema.value, 500);
    debounce(schema.category, 500);
  });

  focusCategoryOnAdd = effect(() => {
    if (this.isAdded()) {
      untracked(() => {
        const newData = this.data().at(-1);
        this.editCategory(newData!);
        setTimeout(() =>
          this.categoryRef()?.nativeElement.scrollIntoView({
            behavior: 'smooth',
          })
        );
      });
    }
  });

  update = effect(() => {
    const category = this.category();
    const value = this.value();
    untracked(() => {
      const isCategoryDirty = this.form.category().dirty();
      const isValueDirty = this.form.value().dirty();
      if ((value && isValueDirty) || (category && isCategoryDirty)) {
        this.updateRow.emit(this.formModel() as DATA);
        this.form().reset();
      }
    });
  });

  trackByFn(index: number, item: DATA) {
    return item?.id;
  }

  setForm(data: DATA) {
    this.formModel.set({
      id: data.id,
      category: data.category!,
      value: data.value!,
    });
  }

  editCategory(row: DATA) {
    this.setForm(row);
    this.selectedRow.set(row.id);
    this.selectedField.set('category');
    setTimeout(() => this.categoryRef()?.nativeElement.select());
  }

  editValue(row: DATA) {
    this.setForm(row);
    this.selectedRow.set(row.id);
    this.selectedField.set('value');
    setTimeout(() => this.valueRef()?.nativeElement.select());
  }

  resetForm() {
    this.selectedRow.set(null);
    this.selectedField.set(null);
    this.formModel.set(this.initForm());
  }

  onCategoryEnterPressed() {
    this.selectedField.set('value');
    setTimeout(() => this.valueRef()?.nativeElement.select());
  }

  private initForm(): Form {
    return {
      id: null,
      category: null!,
      value: null!,
    };
  }
}

interface Form {
  id: number | null;
  category: string;
  value: number;
}

export interface Column {
  name: string;
  template: TemplateRef<unknown>;
}
