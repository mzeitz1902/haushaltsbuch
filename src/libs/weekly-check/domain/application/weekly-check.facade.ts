import { computed, inject, Injectable } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { WeeklyCheckStore } from '../+state/weekly-check.store';
import { weeklyCheckEvents } from '../+state/weekly-check.events';
import {
  WeeklyCheckShops,
  WeeklyHistoryForm,
} from '../entities/weekly-check.model';

@Injectable()
export class WeeklyCheckFacade {
  private readonly events = injectDispatch(weeklyCheckEvents);
  private readonly store = inject(WeeklyCheckStore);

  loadProcessStatus = this.store.loadProcessStatus;
  weeklyChecks = this.store.weeklyChecks;
  currentWeekId = this.store.currentWeekId;
  currentShop = this.store.currentShop;

  isLoading = computed(() => this.loadProcessStatus() === 'pending');
  currentHistory = computed(() => {
    const week = this.weeklyChecks().find((w) => w.id === this.currentWeekId());
    if (!week || !this.currentShop()) return null;
    return week[this.currentShop() as keyof WeeklyCheckShops].history;
  });

  loadWeeklyChecks() {
    this.events.load();
  }

  setCurrentHistoryInformation(
    weeklyCheckId: number,
    shop: keyof WeeklyCheckShops
  ) {
    this.events.setCurrentHistoryInformation({ weeklyCheckId, shop });
  }

  addHistoryEntry() {
    this.events.addHistoryEntry();
  }

  deleteHistoryEntry(id: string) {
    return this.events.deleteHistoryEntry(id);
  }

  updateHistoryEntry(payload: WeeklyHistoryForm) {
    this.events.updateHistoryEntry(payload);
  }
}
