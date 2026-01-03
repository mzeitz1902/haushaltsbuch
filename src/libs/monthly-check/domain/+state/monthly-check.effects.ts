import { inject } from '@angular/core';
import { EventInstance, Events, ReducerEvents } from '@ngrx/signals/events';
import { MonthlyCheckDataService } from '../infrastructure/monthly-check.data.service';
import { monthlyCheckEvents } from './monthly-check.events';
import { map, Observable, pipe, switchMap, UnaryFunction } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { VariableCostsDataService } from '../infrastructure/variable-costs.data.service';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { getState, StateSource } from '@ngrx/signals';
import { MonthlyCheckState } from './monthly-check.store';

export function monthlyCheckEffects(
  store: StateSource<MonthlyCheckState>,
  monthlyCheckDataService = inject(MonthlyCheckDataService),
  variableCostsDataService = inject(VariableCostsDataService),
  events: Events = inject(ReducerEvents),
  router = inject(Router)
) {
  function getMonthId(): UnaryFunction<
    Observable<EventInstance<string, string | void>>,
    Observable<string>
  > {
    return pipe(map(() => getState(store).month!.id));
  }

  return {
    create$: events.on(monthlyCheckEvents.create).pipe(
      switchMap(({ payload: month }) => {
        return monthlyCheckDataService.createMonth(month).pipe(
          mapResponse({
            next: () => monthlyCheckEvents.createSuccess(month),
            error: (error) => monthlyCheckEvents.createFailure(error),
          })
        );
      })
    ),

    navigateOnCreateSuccess$: events.on(monthlyCheckEvents.createSuccess).pipe(
      switchMap(({ payload: date }) => {
        const _date = dayjs(date);
        return router.navigateByUrl(
          `/monthly-check/${_date.year()}/${_date.format('MM')}`
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
      getMonthId(),
      switchMap((monthId) => {
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

    updateVariableCostHistoryEntry$: events
      .on(monthlyCheckEvents.updateVariableCostHistoryEntry)
      .pipe(
        switchMap(({ payload: { monthId, variableCostId, entry } }) => {
          return variableCostsDataService
            .updateVariableCostHistoryEntry(monthId, variableCostId, entry)
            .pipe(
              mapResponse({
                next: (variableCost) =>
                  monthlyCheckEvents.updateVariableCostHistoryEntrySuccess(
                    variableCost
                  ),
                error: (error) =>
                  monthlyCheckEvents.updateVariableCostHistoryEntryFailure(
                    error
                  ),
              })
            );
        })
      ),

    addBudget$: events.on(monthlyCheckEvents.addBudget).pipe(
      getMonthId(),
      switchMap((id) =>
        variableCostsDataService.addBudget(id).pipe(
          mapResponse({
            next: () => monthlyCheckEvents.addBudgetSuccess(),
            error: (error) => monthlyCheckEvents.addBudgetFailure(error),
          })
        )
      )
    ),

    deleteBudget$: events.on(monthlyCheckEvents.deleteBudget).pipe(
      map(({ payload: id }) => ({ id, monthId: getState(store).month!.id })),
      switchMap(({ id, monthId }) =>
        variableCostsDataService.deleteBudget(monthId, id).pipe(
          mapResponse({
            next: () => monthlyCheckEvents.deleteBudgetSuccess(),
            error: (error) => monthlyCheckEvents.deleteBudgetFailure(error),
          })
        )
      )
    ),

    addBudgetHistoryEntry$: events
      .on(monthlyCheckEvents.addBudgetHistoryEntry)
      .pipe(
        map(({ payload: budgetId }) => ({
          budgetId,
          monthId: getState(store).month!.id,
        })),
        switchMap(({ budgetId, monthId }) =>
          variableCostsDataService
            .addBudgetHistoryEntry(monthId, budgetId)
            .pipe(
              mapResponse({
                next: () => monthlyCheckEvents.addBudgetHistoryEntrySuccess(),
                error: (error) =>
                  monthlyCheckEvents.addBudgetHistoryEntryFailure(error),
              })
            )
        )
      ),

    deleteBudgetHistoryEntry$: events
      .on(monthlyCheckEvents.deleteBudgetHistoryEntry)
      .pipe(
        map(({ payload: { budgetId, entryId } }) => ({
          budgetId,
          entryId,
          monthId: getState(store).month!.id,
        })),
        switchMap(({ budgetId, entryId, monthId }) =>
          variableCostsDataService
            .deleteBudgetHistoryEntry(monthId, budgetId, entryId)
            .pipe(
              mapResponse({
                next: () =>
                  monthlyCheckEvents.deleteBudgetHistoryEntrySuccess(),
                error: (error) =>
                  monthlyCheckEvents.deleteBudgetHistoryEntryFailure(error),
              })
            )
        )
      ),

    updateBudgetHistoryEntry$: events
      .on(monthlyCheckEvents.updateBudgetHistoryEntry)
      .pipe(
        map(({ payload: { budgetId, entry } }) => ({
          budgetId,
          entry,
          monthId: getState(store).month!.id,
        })),
        switchMap(({ budgetId, entry, monthId }) =>
          variableCostsDataService
            .updateBudgetHistoryEntry(monthId, budgetId, entry)
            .pipe(
              mapResponse({
                next: () =>
                  monthlyCheckEvents.updateBudgetHistoryEntrySuccess(),
                error: (error) =>
                  monthlyCheckEvents.updateBudgetHistoryEntryFailure(error),
              })
            )
        )
      ),

    reloadMonth$: events
      .on(
        monthlyCheckEvents.addVariableCostSuccess,
        monthlyCheckEvents.addBudgetSuccess,
        monthlyCheckEvents.deleteBudgetSuccess,
        monthlyCheckEvents.addBudgetHistoryEntrySuccess,
        monthlyCheckEvents.deleteBudgetHistoryEntrySuccess,
        monthlyCheckEvents.updateBudgetHistoryEntrySuccess
      )
      .pipe(
        map(() => getState(store).month!.month),
        map((month) => monthlyCheckEvents.getMonth(month))
      ),
  };
}
