import { computed, inject, Injectable } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { WeeklyCheckStore } from '../+state/weekly-check.store';
import { weeklyCheckEvents } from '../+state/weekly-check.events';
import { WeeklyCheckShops } from '../entities/weekly-check.model';

@Injectable()
export class WeeklyCheckFacade {
  private readonly events = injectDispatch(weeklyCheckEvents);
  private readonly store = inject(WeeklyCheckStore);

  loadProcessStatus = this.store.loadProcessStatus;
  weeklyChecks = this.store.weeklyChecks;

  isLoading = computed(() => this.loadProcessStatus() === 'pending');

  loadWeeklyChecks() {
    this.events.load();
  }

  addHistoryEntry(weeklyCheckId: number, column: keyof WeeklyCheckShops) {
    this.events.addHistoryEntry({ weeklyCheckId, column });
  }
}
