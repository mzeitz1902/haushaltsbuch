import { inject } from '@angular/core';
import { Events } from '@ngrx/signals/events';
import { FixedCostsDataService } from '../infrastructure/fixed-costs.data.service';
import { fixedCostsEvents } from './fixed-costs.events';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';

export function fixedCostsEffects() {
  const events = inject(Events);
  const dataService = inject(FixedCostsDataService);

  return {
    $load: events.on(fixedCostsEvents.load).pipe(
      switchMap(() => {
        return dataService.getFixedCosts().pipe(
          mapResponse({
            next: (costs) => fixedCostsEvents.loadSuccess(costs),
            error: console.error,
          })
        );
      })
    ),

    add$: events.on(fixedCostsEvents.add).pipe(
      switchMap(({ payload: fixedCost }) => {
        return dataService.addFixedCost(fixedCost).pipe(
          mapResponse({
            next: (fixedCost) => {
              return fixedCostsEvents.addSuccess(fixedCost);
            },
            error: (error) => fixedCostsEvents.addFailure(error),
          })
        );
      })
    ),

    update$: events.on(fixedCostsEvents.update).pipe(
      switchMap(({ payload: fixedCost }) => {
        return dataService.updateFixedCost(fixedCost).pipe(
          mapResponse({
            next: (fixedCost) => {
              return fixedCostsEvents.updateSuccess(fixedCost);
            },
            error: (error) => fixedCostsEvents.updateFailure(error),
          })
        );
      })
    ),

    delete$: events.on(fixedCostsEvents.delete).pipe(
      switchMap(({ payload: id }) => {
        return dataService.deleteFixedCost(id).pipe(
          mapResponse({
            next: () => fixedCostsEvents.deleteSuccess(id),
            error: (error) => fixedCostsEvents.deleteFailure(error),
          })
        );
      })
    ),
  };
}
