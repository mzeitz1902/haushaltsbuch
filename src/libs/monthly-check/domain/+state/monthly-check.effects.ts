import { inject } from '@angular/core';
import { Events } from '@ngrx/signals/events';
import { MonthlyCheckDataService } from '../infrastructure/monthly-check.data.service';
import { monthlyCheckEvents } from './monthly-check.events';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { VariableCostsDataService } from '../infrastructure/variable-costs.data.service';

export function monthlyCheckEffects(
  monthlyCheckDataService = inject(MonthlyCheckDataService),
  variableCostsDataService = inject(VariableCostsDataService),
  events: Events = inject(Events)
) {
  return {
    create$: events.on(monthlyCheckEvents.create).pipe(
      switchMap(({ payload: month }) => {
        return monthlyCheckDataService.createMonth(month).pipe(
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
        return monthlyCheckDataService.getCreatedMonths().pipe(
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
        return monthlyCheckDataService.getMonth(month).pipe(
          mapResponse({
            next: (month) => monthlyCheckEvents.getMonthSuccess(month),
            error: (error) => monthlyCheckEvents.getMonthFailure(error),
          })
        );
      })
    ),

    addRevenue$: events.on(monthlyCheckEvents.addRevenue).pipe(
      switchMap(({ payload: monthId }) => {
        return monthlyCheckDataService.addRevenue(monthId).pipe(
          mapResponse({
            next: (revenue) => monthlyCheckEvents.addRevenueSuccess(revenue),
            error: (error) => monthlyCheckEvents.addRevenueFailure(error),
          })
        );
      })
    ),

    updateRevenue$: events.on(monthlyCheckEvents.updateRevenue).pipe(
      switchMap(({ payload: { revenue, monthId } }) => {
        return monthlyCheckDataService.updateRevenue(monthId, revenue).pipe(
          mapResponse({
            next: (revenue) => monthlyCheckEvents.updateRevenueSuccess(revenue),
            error: (error) => monthlyCheckEvents.updateRevenueFailure(error),
          })
        );
      })
    ),

    deleteRevenue$: events.on(monthlyCheckEvents.deleteRevenue).pipe(
      switchMap(({ payload: { monthId, revenueId } }) => {
        return monthlyCheckDataService.deleteRevenue(monthId, revenueId).pipe(
          mapResponse({
            next: (revenue) => monthlyCheckEvents.deleteRevenueSuccess(revenue),
            error: (error) => monthlyCheckEvents.deleteRevenueFailure(error),
          })
        );
      })
    ),

    addFixedCost$: events.on(monthlyCheckEvents.addFixedCost).pipe(
      switchMap(({ payload: monthId }) => {
        return monthlyCheckDataService.addFixedCost(monthId).pipe(
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
        return monthlyCheckDataService.updateFixedCost(monthId, fixedCost).pipe(
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
        return monthlyCheckDataService
          .deleteFixedCost(monthId, fixedCostId)
          .pipe(
            mapResponse({
              next: (fixedCost) =>
                monthlyCheckEvents.deleteFixedCostSuccess(fixedCost),
              error: (error) =>
                monthlyCheckEvents.deleteFixedCostFailure(error),
            })
          );
      })
    ),

    addVariableCost$: events.on(monthlyCheckEvents.addVariableCost).pipe(
      switchMap(({ payload: monthId }) => {
        return variableCostsDataService.addVariableCost(monthId).pipe(
          mapResponse({
            next: (fixedCost) =>
              monthlyCheckEvents.addVariableCostSuccess(fixedCost),
            error: (error) => monthlyCheckEvents.addVariableCostFailure(error),
          })
        );
      })
    ),

    updateVariableCost$: events.on(monthlyCheckEvents.updateVariableCost).pipe(
      switchMap(({ payload: { variableCost, monthId } }) => {
        return variableCostsDataService
          .updateVariableCost(monthId, variableCost)
          .pipe(
            mapResponse({
              next: (variableCost) =>
                monthlyCheckEvents.updateVariableCostSuccess(variableCost),
              error: (error) =>
                monthlyCheckEvents.updateVariableCostFailure(error),
            })
          );
      })
    ),

    deleteVariableCost$: events.on(monthlyCheckEvents.deleteVariableCost).pipe(
      switchMap(({ payload: { monthId, variableCostId } }) => {
        return variableCostsDataService
          .deleteVariableCost(monthId, variableCostId)
          .pipe(
            mapResponse({
              next: (fixedCost) =>
                monthlyCheckEvents.deleteVariableCostSuccess(fixedCost),
              error: (error) =>
                monthlyCheckEvents.deleteVariableCostFailure(error),
            })
          );
      })
    ),

    addVariableCostHistoryEntry$: events
      .on(monthlyCheckEvents.addVariableCostHistoryEntry)
      .pipe(
        switchMap(({ payload: { monthId, variableCostId } }) => {
          return variableCostsDataService
            .addVariableCostHistoryEntry(monthId, variableCostId)
            .pipe(
              mapResponse({
                next: (variableCost) =>
                  monthlyCheckEvents.addVariableCostHistoryEntrySuccess(
                    variableCost
                  ),
                error: (error) =>
                  monthlyCheckEvents.addVariableCostHistoryEntryFailure(error),
              })
            );
        })
      ),

    deleteVariableCostHistoryEntry$: events
      .on(monthlyCheckEvents.deleteVariableCostHistoryEntry)
      .pipe(
        switchMap(({ payload: { monthId, variableCostId, entryId } }) => {
          return variableCostsDataService
            .deleteVariableCostHistoryEntry(monthId, variableCostId, entryId)
            .pipe(
              mapResponse({
                next: (variableCost) =>
                  monthlyCheckEvents.deleteVariableCostHistoryEntrySuccess(
                    variableCost
                  ),
                error: (error) =>
                  monthlyCheckEvents.deleteVariableCostHistoryEntryFailure(
                    error
                  ),
              })
            );
        })
      ),
  };
}
