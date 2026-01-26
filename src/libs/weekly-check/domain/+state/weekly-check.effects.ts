import { inject } from '@angular/core';
import { EventInstance, ReducerEvents } from '@ngrx/signals/events';
import { WeeklyCheckDataService } from '../infrastructure/weekly-check.data.service';
import { weeklyCheckEvents } from './weekly-check.events';
import { map, Observable, pipe, switchMap, UnaryFunction } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { getState, StateSource } from '@ngrx/signals';
import { WeeklyCheckState } from './weekly-check.store';
import {
  WeeklyCheckShops,
  WeeklyHistoryForm,
} from '@haushaltsbuch/weekly-check/domain';

export function weeklyCheckEffects(
  store: StateSource<WeeklyCheckState>,
  events = inject(ReducerEvents),
  dataService = inject(WeeklyCheckDataService)
) {
  function getWeekIdAndShop<
    T extends string | void | WeeklyHistoryForm,
  >(): UnaryFunction<
    Observable<EventInstance<string, T>>,
    Observable<{
      weeklyCheckId: number;
      shop: keyof WeeklyCheckShops;
      payload: T;
    }>
  > {
    return pipe(
      map((event) => {
        const state = getState(store);
        return {
          weeklyCheckId: state.currentWeekId!,
          shop: state.currentShop!,
          payload: event.payload,
        };
      })
    );
  }
  return {
    load$: events
      .on(
        weeklyCheckEvents.load,
        weeklyCheckEvents.addHistoryEntrySuccess,
        weeklyCheckEvents.deleteHistoryEntrySuccess,
        weeklyCheckEvents.updateHistoryEntrySuccess,
        weeklyCheckEvents.createWeekSuccess
      )
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

    deleteHistoryEntry$: events.on(weeklyCheckEvents.deleteHistoryEntry).pipe(
      getWeekIdAndShop(),
      switchMap(({ weeklyCheckId, shop, payload: historyId }) => {
        return dataService
          .deleteHistoryEntry(weeklyCheckId, historyId, shop)
          .pipe(
            mapResponse({
              next: () => weeklyCheckEvents.deleteHistoryEntrySuccess(),
              error: console.error,
            })
          );
      })
    ),

    updateHistoryEntry$: events.on(weeklyCheckEvents.updateHistoryEntry).pipe(
      getWeekIdAndShop(),
      switchMap(({ weeklyCheckId, shop, payload }) =>
        dataService.updateHistoryEntry(weeklyCheckId, shop, payload).pipe(
          mapResponse({
            next: () => weeklyCheckEvents.updateHistoryEntrySuccess(),
            error: console.error,
          })
        )
      )
    ),

    createWeek$: events.on(weeklyCheckEvents.createWeek).pipe(
      switchMap(() =>
        dataService.createWeek().pipe(
          mapResponse({
            next: () => weeklyCheckEvents.createWeekSuccess(),
            error: console.error,
          })
        )
      )
    ),
  };
}
