import { inject } from '@angular/core';
import { Events, withEffects } from '@ngrx/signals/events';
import { MonthlyCheckDataService } from '../infrastructure/monthly-check.data.service';
import { monthlyCheckEvents } from './monthly-check.events';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { signalStoreFeature } from '@ngrx/signals';
import { monthlyCheckStore } from './monthly-check.store';

export function withMonthlyCheckEffects() {
  return signalStoreFeature(withEffects((store) => monthlyCheckEffects(store)));
}

function monthlyCheckEffects(store: InstanceType<typeof monthlyCheckStore>) {
  const events = inject(Events);
  const dataService = inject(MonthlyCheckDataService);
  const id = store.month?['id'] ?? '1';

  return {
    create$: events.on(monthlyCheckEvents.create).pipe(
      switchMap(({ payload: month }) => {
        return dataService.createMonth(month).pipe(
          mapResponse({
            next: (res) => {
              return monthlyCheckEvents.createSuccess(res);
            },
            error: (error) => monthlyCheckEvents.createFailure(error),
          })
        );
      })
    ),

    getCreatedMonths$: events.on(monthlyCheckEvents.getCreatedMonths).pipe(
      switchMap(() => {
        return dataService.getCreatedMonths().pipe(
          mapResponse({
            next: (months) =>
              monthlyCheckEvents.getCreatedMonthsSuccess(months),
            error: (error) => monthlyCheckEvents.getCreatedMonthsFailure(error),
          })
        );
      })
    ),

    getMonth$: events.on(monthlyCheckEvents.getMonth).pipe(
      switchMap(({ payload: month }) => {
        return dataService.getMonth(month).pipe(
          mapResponse({
            next: (month) => monthlyCheckEvents.getMonthSuccess(month),
            error: (error) => monthlyCheckEvents.getMonthFailure(error),
          })
        );
      })
    ),

    updateRevenue$: events.on(monthlyCheckEvents.updateRevenue).pipe(
      switchMap(({ payload: revenue }) => {
        return dataService.updateRevenue('1', revenue).pipe(
          mapResponse({
            next: (revenue) => monthlyCheckEvents.updateRevenueSuccess(revenue),
            error: (error) => monthlyCheckEvents.updateRevenueFailure(error),
          })
        );
      })
    ),
  };
}
