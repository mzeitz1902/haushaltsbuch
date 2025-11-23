import { computed, inject, Injectable } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { FixedCostsStore } from '../+state/fixed-costs.store';
import { fixedCostsEvents } from '../+state/fixed-costs.events';
import {
  AddFixedCostPayload,
  UpdateFixedCostPayload,
} from '../entities/fixed-cost.model';
import { DueIn } from '@haushaltsbuch/shared/sdks';

@Injectable()
export class FixedCostsFacade {
  private readonly dispatcher = inject(Dispatcher);
  private readonly store = inject(FixedCostsStore);

  loadProcessStatus = this.store.loadProcessStatus;
  saveProcessStatus = this.store.saveProcessStatus;
  addFixedProcessStatus = this.store.addFixedProcessStatus;
  addQuarterlyProcessStatus = this.store.addQuarterlyProcessStatus;
  addSpecialProcessStatus = this.store.addSpecialProcessStatus;
  fixedCosts = this.store.fixedCosts;
  quarterlyCosts = this.store.quarterlyCosts;
  specialCosts = this.store.specialCosts;

  isLoading = computed(() => this.loadProcessStatus() === 'pending');
  isSaving = computed(() => this.saveProcessStatus() === 'pending');
  isFixedAdded = computed(() => this.addFixedProcessStatus() === 'success');
  isQuarterlyAdded = computed(
    () => this.addQuarterlyProcessStatus() === 'success'
  );
  isSpecialAdded = computed(() => this.addSpecialProcessStatus() === 'success');

  totalFixedCosts = computed(() =>
    this.store.fixedCosts().reduce((acc, r) => acc + r.value!, 0)
  );

  totalQuarterlyCosts = computed(() =>
    this.quarterlyCosts().reduce((acc, r) => acc + r.value!, 0)
  );

  totalSpecialCosts = computed(() =>
    this.specialCosts().reduce((acc, r) => acc + r.value!, 0)
  );

  loadFixedCosts() {
    this.dispatcher.dispatch(fixedCostsEvents.load());
  }

  add(fixedCosts: AddFixedCostPayload) {
    this.dispatcher.dispatch(fixedCostsEvents.add(fixedCosts));
  }

  update(payload: UpdateFixedCostPayload) {
    this.dispatcher.dispatch(fixedCostsEvents.update(payload));
  }

  delete(id: number, dueIn: DueIn) {
    this.dispatcher.dispatch(fixedCostsEvents.delete({ id, dueIn }));
  }
}
