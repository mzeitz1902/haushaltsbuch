import {
  Component,
  computed,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MoneyTableComponent } from '@haushaltsbuch/shared/ui-components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FixedCost,
  FixedCostsFacade,
  UpdateFixedCostPayload,
} from '@haushaltsbuch/fixed-costs/domain';
import { DueIn } from '@haushaltsbuch/shared/sdks';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-fixed-costs-table',
  imports: [
    MatProgressSpinnerModule,
    MoneyTableComponent,
    NgSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fixed-costs-table.component.html',
})
export class FixedCostsTableComponent {
  private readonly facade = inject(FixedCostsFacade);

  fixedCosts = this.facade.fixedCosts;
  isLoading = this.facade.isLoading;
  isSaving = this.facade.isSaving;
  isAdded = this.facade.isAdded;

  dueInMonthsTmp = viewChild.required<TemplateRef<unknown>>('dueInMonths');
  selectTmpRef = viewChild<NgSelectComponent>(NgSelectComponent);

  additionalColumns = computed(() => [
    { name: 'due_in_month', template: this.dueInMonthsTmp() },
  ]);

  dueInItems = Object.values(DueIn);
  dueInControl = new FormControl<DueIn | null>(null);

  selectedRow = signal<number | null>(null);

  constructor() {
    this.facade.loadFixedCosts();
  }

  addFixedCost() {
    this.facade.addFixedCost({ category: '', value: 0, due_in: 'Alle' });
  }

  updateFixedCost(fixedCost: FixedCost) {
    const _fixedCost: UpdateFixedCostPayload = {
      ...fixedCost,
      due_in: this.dueInControl.value ?? fixedCost.due_in,
    } as UpdateFixedCostPayload;
    this.facade.updateFixedCost(_fixedCost);
    this.selectedRow.set(null);
    this.dueInControl.setValue(null);
  }

  deleteFixedCost(id: number) {
    this.facade.deleteFixedCost(id);
  }

  selectRow(id: number, dueIn: DueIn | null) {
    this.selectedRow.set(id);
    this.dueInControl.setValue(dueIn);
    setTimeout(() => this.selectTmpRef()?.open());
  }
}
