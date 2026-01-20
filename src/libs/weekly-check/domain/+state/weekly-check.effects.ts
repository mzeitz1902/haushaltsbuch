import { inject } from '@angular/core';
import { ReducerEvents } from '@ngrx/signals/events';
import { WeeklyCheckDataService } from '../infrastructure/weekly-check.data.service';
import { weeklyCheckEvents } from './weekly-check.events';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { StateSource } from '@ngrx/signals';
import { WeeklyCheckState } from './weekly-check.store';

export function weeklyCheckEffects(
  store: StateSource<WeeklyCheckState>,
  events = inject(ReducerEvents),
  dataService = inject(WeeklyCheckDataService)
) {
  return {
    load$: events
      .on(weeklyCheckEvents.load, weeklyCheckEvents.addHistoryEntrySuccess)
      .pipe(
        switchMap(() =>
          dataService.getWeeklyChecks().pipe(
            mapResponse({
              next: (checks) => weeklyCheckEvents.loadSuccess(checks),
              error: console.error,
            })
          )
        )
      ),

    addHistoryEntry$: events.on(weeklyCheckEvents.addHistoryEntry).pipe(
      switchMap(({ payload: { weeklyCheckId, column } }) =>
        dataService.addHistoryEntry(weeklyCheckId, column).pipe(
          mapResponse({
            next: () => weeklyCheckEvents.addHistoryEntrySuccess(),
            error: console.error,
          })
        )
      )
    ),
  };
}
