import { computed, inject, Injectable } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { revenueEvents } from '../+state/revenue.events';
import { RevenueStore } from '../+state/revenue.store';
import {
  AddRevenuePayload,
  UpdateRevenuePayload,
} from '../entities/revenue.model';

@Injectable()
export class RevenueFacade {
  private readonly dispatcher = inject(Dispatcher);
  private readonly store = inject(RevenueStore);

  loadProcessStatus = this.store.loadProcessStatus;
  saveProcessStatus = this.store.saveProcessStatus;
  addProcessStatus = this.store.addProcessStatus;
  revenue = this.store.revenue;

  isLoading = computed(() => this.loadProcessStatus() === 'pending');
  isSaving = computed(() => this.saveProcessStatus() === 'pending');
  isAdded = computed(() => this.addProcessStatus() === 'success');

  total = computed(() =>
    this.store.revenue().reduce((acc, r) => acc + r.value!, 0)
  );

  loadRevenue() {
    this.dispatcher.dispatch(revenueEvents.load());
  }

  addRevenue(revenue: AddRevenuePayload) {
    this.dispatcher.dispatch(revenueEvents.add(revenue));
  }

  updateRevenue(payload: UpdateRevenuePayload) {
    this.dispatcher.dispatch(revenueEvents.update(payload));
  }

  deleteRevenue(id: number) {
    this.dispatcher.dispatch(revenueEvents.delete(id));
  }
}
