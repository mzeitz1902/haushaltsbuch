import { inject } from '@angular/core';
import { Events } from '@ngrx/signals/events';
import { MonthlyCheckDataService } from '../infrastructure/monthly-check.data.service';
import { monthlyCheckEvents } from './monthly-check.events';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';

export function monthlyCheckEffects(
  dataService = inject(MonthlyCheckDataService),
  events: Events = inject(Events)
) {
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

    addRevenue$: events.on(monthlyCheckEvents.addRevenue).pipe(
      switchMap(({ payload: monthId }) => {
        return dataService.addRevenue(monthId).pipe(
          mapResponse({
            next: (revenue) => monthlyCheckEvents.addRevenueSuccess(revenue),
            error: (error) => monthlyCheckEvents.addRevenueFailure(error),
          })
        );
      })
    ),

    updateRevenue$: events.on(monthlyCheckEvents.updateRevenue).pipe(
      switchMap(({ payload: { revenue, monthId } }) => {
        return dataService.updateRevenue(monthId, revenue).pipe(
          mapResponse({
            next: (revenue) => monthlyCheckEvents.updateRevenueSuccess(revenue),
            error: (error) => monthlyCheckEvents.updateRevenueFailure(error),
          })
        );
      })
    ),

    deleteRevenue$: events.on(monthlyCheckEvents.deleteRevenue).pipe(
      switchMap(({ payload: { monthId, revenueId } }) => {
        return dataService.deleteRevenue(monthId, revenueId).pipe(
          mapResponse({
            next: (revenue) => monthlyCheckEvents.deleteRevenueSuccess(revenue),
            error: (error) => monthlyCheckEvents.deleteRevenueFailure(error),
          })
        );
      })
    ),
  };
}
