import { inject } from '@angular/core';
import { Events } from '@ngrx/signals/events';
import { RevenueDataService } from '../infrastructure/revenue.data.service';
import { revenueEvents } from './revenue.events';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';

export function revenueEffects() {
  const events = inject(Events);
  const dataService = inject(RevenueDataService);

  return {
    $load: events.on(revenueEvents.load).pipe(
      switchMap(() => {
        return dataService.getRevenue().pipe(
          mapResponse({
            next: (costs) => revenueEvents.loadSuccess(costs),
            error: console.error,
          })
        );
      })
    ),

    add$: events.on(revenueEvents.add).pipe(
      switchMap(({ payload: revenue }) => {
        return dataService.addRevenue(revenue).pipe(
          mapResponse({
            next: (revenue) => {
              return revenueEvents.addSuccess(revenue);
            },
            error: (error) => revenueEvents.addFailure(error),
          })
        );
      })
    ),

    update$: events.on(revenueEvents.update).pipe(
      switchMap(({ payload: revenue }) => {
        return dataService.updateRevenue(revenue).pipe(
          mapResponse({
            next: (revenue) => {
              return revenueEvents.updateSuccess(revenue);
            },
            error: (error) => revenueEvents.updateFailure(error),
          })
        );
      })
    ),

    delete$: events.on(revenueEvents.delete).pipe(
      switchMap(({ payload: id }) => {
        return dataService.deleteRevenue(id).pipe(
          mapResponse({
            next: () => revenueEvents.deleteSuccess(id),
            error: (error) => revenueEvents.deleteFailure(error),
          })
        );
      })
    ),
  };
}
