import { inject } from '@angular/core';
import { Events } from '@ngrx/signals/events';
import { WeeklyCheckDataService } from '../infrastructure/weekly-check.data.service';
import { weeklyCheckEvents } from './weekly-check.events';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';

export function weeklyCheckEffects() {
  const events = inject(Events);
  const dataService = inject(WeeklyCheckDataService);

  return {
    load$: events.on(weeklyCheckEvents.load).pipe(
      switchMap(() =>
        dataService.getWeeklyChecks().pipe(
          mapResponse({
            next: (checks) => weeklyCheckEvents.loadSuccess(checks),
            error: console.error,
          })
        )
      )
    ),
  };
}
