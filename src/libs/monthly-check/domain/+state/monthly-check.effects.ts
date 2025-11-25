import { inject } from '@angular/core';
import { Events, withEffects } from '@ngrx/signals/events';
import { MonthlyCheckDataService } from '../infrastructure/monthly-check.data.service';
import { monthlyCheckEvents } from './monthly-check.events';
import { switchMap } from 'rxjs';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { SignalStoreFeature, signalStoreFeature } from '@ngrx/signals';
import { MonthlyCheckFacade } from '@haushaltsbuch/monthly-check/domain';

export function withMonthlyCheckEffects(): SignalStoreFeature {
  return signalStoreFeature(
    withEffects(
      (
        _,
        facade = inject(MonthlyCheckFacade),
        dataService = inject(MonthlyCheckDataService),
        events = inject(Events)
      ) => {
        const id$ = facade.currentMonthId$;
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

          getCreatedMonths$: events
            .on(monthlyCheckEvents.getCreatedMonths)
            .pipe(
              switchMap(() => {
                return dataService.getCreatedMonths().pipe(
                  mapResponse({
                    next: (months) =>
                      monthlyCheckEvents.getCreatedMonthsSuccess(months),
                    error: (error) =>
                      monthlyCheckEvents.getCreatedMonthsFailure(error),
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
            concatLatestFrom(() => id$),
            switchMap(([{ payload: revenue }, id]) => {
              return dataService.updateRevenue(id!, revenue).pipe(
                mapResponse({
                  next: (revenue) =>
                    monthlyCheckEvents.updateRevenueSuccess(revenue),
                  error: (error) =>
                    monthlyCheckEvents.updateRevenueFailure(error),
                })
              );
            })
          ),
        };
      }
    )
  );
}
