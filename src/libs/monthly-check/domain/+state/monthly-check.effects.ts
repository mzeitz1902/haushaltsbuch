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

    addFixedCost$: events.on(monthlyCheckEvents.addFixedCost).pipe(
      switchMap(({ payload: monthId }) => {
        return dataService.addFixedCost(monthId).pipe(
          mapResponse({
            next: (fixedCost) =>
              monthlyCheckEvents.addFixedCostSuccess(fixedCost),
            error: (error) => monthlyCheckEvents.addFixedCostFailure(error),
          })
        );
      })
    ),

    updateFixedCost$: events.on(monthlyCheckEvents.updateFixedCost).pipe(
      switchMap(({ payload: { fixedCost, monthId } }) => {
        return dataService.updateFixedCost(monthId, fixedCost).pipe(
          mapResponse({
            next: (fixedCost) =>
              monthlyCheckEvents.updateFixedCostSuccess(fixedCost),
            error: (error) => monthlyCheckEvents.updateFixedCostFailure(error),
          })
        );
      })
    ),

    deleteFixedCost$: events.on(monthlyCheckEvents.deleteFixedCost).pipe(
      switchMap(({ payload: { monthId, fixedCostId } }) => {
        return dataService.deleteFixedCost(monthId, fixedCostId).pipe(
          mapResponse({
            next: (fixedCost) =>
              monthlyCheckEvents.deleteFixedCostSuccess(fixedCost),
            error: (error) => monthlyCheckEvents.deleteFixedCostFailure(error),
          })
        );
      })
    ),
  };
}
