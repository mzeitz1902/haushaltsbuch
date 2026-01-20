import { inject } from '@angular/core';
import { EventInstance, ReducerEvents } from '@ngrx/signals/events';
import { WeeklyCheckDataService } from '../infrastructure/weekly-check.data.service';
import { weeklyCheckEvents } from './weekly-check.events';
import { map, Observable, pipe, switchMap, UnaryFunction } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { getState, StateSource } from '@ngrx/signals';
import { WeeklyCheckState } from './weekly-check.store';
import { WeeklyCheckShops } from '@haushaltsbuch/weekly-check/domain';

export function weeklyCheckEffects(
  store: StateSource<WeeklyCheckState>,
  events = inject(ReducerEvents),
  dataService = inject(WeeklyCheckDataService)
) {
  function getWeekIdAndShop(): UnaryFunction<
    Observable<EventInstance<string, void>>,
    Observable<{ weeklyCheckId: number; shop: keyof WeeklyCheckShops }>
  > {
    return pipe(
      map(() => {
        const state = getState(store);
        return {
          weeklyCheckId: state.currentWeekId!,
          shop: state.currentShop!,
        };
      })
    );
  }
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
      getWeekIdAndShop(),
      switchMap(({ weeklyCheckId, shop }) =>
        dataService.addHistoryEntry(weeklyCheckId, shop).pipe(
          mapResponse({
            next: () => weeklyCheckEvents.addHistoryEntrySuccess(),
            error: console.error,
          })
        )
      )
    ),
  };
}
