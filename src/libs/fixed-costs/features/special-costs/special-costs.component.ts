import {
  Component,
  computed,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MoneyTableComponent } from '@haushaltsbuch/shared/ui-components';
import { FixedCost, FixedCostsFacade } from '@haushaltsbuch/fixed-costs/domain';
import { NgSelectComponent } from '@ng-select/ng-select';
import dayjs from 'dayjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToMonthPipe } from '@haushaltsbuch/shared/util-pipes';

@Component({
  selector: 'app-special-costs',
  imports: [
    MoneyTableComponent,
    NgSelectComponent,
    ReactiveFormsModule,
    ToMonthPipe,
  ],
  templateUrl: './special-costs.component.html',
  styles: ``,
})
export class SpecialCostsComponent {
  private readonly facade = inject(FixedCostsFacade);

  specialCosts = this.facade.specialCosts;
  total = this.facade.totalSpecialCosts;
  isLoading = this.facade.isLoading;
  isAdded = this.facade.isSpecialAdded;

  dueInMonthsTmp = viewChild.required<TemplateRef<unknown>>('dueInMonth');
  selectTmpRef = viewChild<NgSelectComponent>(NgSelectComponent);

  selectedRow = signal<number | null>(null);
  additionalColumns = computed(() => [
    { name: 'due_in_month', template: this.dueInMonthsTmp() },
  ]);

  dueInMonthControl = new FormControl<Month[]>([], { nonNullable: true });

  readonly months = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().month(i);
    return { label: d.format('MMMM'), value: d.format('YYYY-MM-DD') };
  });

  selectRow(id: number, dueIn: string[] | null) {
    this.selectedRow.set(id);
    const _dueIn = dueIn ?? [];
    const dueInAsMonths: Month[] = _dueIn.map((d) => ({
      label: dayjs(d).format('MMMM'),
      value: d,
    }));
    this.dueInMonthControl.setValue(dueInAsMonths);
    setTimeout(() => this.selectTmpRef()?.open());
  }

  add() {
    this.facade.add({
      category: 'Neu',
      value: 0,
      due_in: 'Sonder',
      type: 'Fix',
    });
  }

  addValue(cost: FixedCost) {
    let dueInMonth = cost.due_in_month ?? [];
    dueInMonth = dueInMonth.map((d) => dayjs(d).format('YYYY-MM'));
    const newValue = this.dueInMonthControl.value.map((d) =>
      dayjs(d.value).format('YYYY-MM')
    );
    dueInMonth = Array.from(new Set([...dueInMonth, ...newValue]));
    dueInMonth = dueInMonth.map((d) => dayjs(d).format('YYYY-MM-DD'));
    const _cost: FixedCost = {
      ...cost,
      due_in_month: dueInMonth,
    };
    _cost.due_in_month = Array.from(new Set(_cost.due_in_month));
    this.facade.update(_cost);
    this.selectedRow.set(null);
    this.dueInMonthControl.setValue(null!);
  }

  removeValue(cost: FixedCost, month: Month) {
    const dueInMonth = cost.due_in_month ?? [];
    const newDueInMonth = dueInMonth.filter(
      (d) => dayjs(d).month() !== dayjs(month.value).month()
    );
    const _cost: FixedCost = {
      ...cost,
      due_in_month: newDueInMonth,
    };
    this.facade.update(_cost);
  }

  delete(id: number) {
    this.facade.delete(id, 'Sonder', 'Fix');
  }
}

interface Month {
  label: string;
  value: string;
}
