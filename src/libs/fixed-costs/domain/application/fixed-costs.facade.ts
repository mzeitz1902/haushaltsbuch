import { computed, inject, Injectable } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { FixedCostsStore } from '../+state/fixed-costs.store';
import { fixedCostsEvents } from '../+state/fixed-costs.events';
import {
  AddFixedCostPayload,
  UpdateFixedCostPayload,
} from '../entities/fixed-cost.model';

@Injectable()
export class FixedCostsFacade {
  private readonly dispatcher = inject(Dispatcher);
  private readonly store = inject(FixedCostsStore);

  loadProcessStatus = this.store.loadProcessStatus;
  saveProcessStatus = this.store.saveProcessStatus;
  addProcessStatus = this.store.addProcessStatus;
  fixedCosts = this.store.fixedCosts;

  isLoading = computed(() => this.loadProcessStatus() === 'pending');
  isSaving = computed(() => this.saveProcessStatus() === 'pending');
  isAdded = computed(() => this.addProcessStatus() === 'success');

  loadFixedCosts() {
    this.dispatcher.dispatch(fixedCostsEvents.load());
  }

  addFixedCost(fixedCosts: AddFixedCostPayload) {
    this.dispatcher.dispatch(fixedCostsEvents.add(fixedCosts));
  }

  updateFixedCost(payload: UpdateFixedCostPayload) {
    this.dispatcher.dispatch(fixedCostsEvents.update(payload));
  }

  deleteFixedCost(id: number) {
    this.dispatcher.dispatch(fixedCostsEvents.delete(id));
  }
}
