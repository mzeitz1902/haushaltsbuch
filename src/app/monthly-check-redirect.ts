import { inject } from '@angular/core';
import { MonthlyCheckFacade } from '@haushaltsbuch/monthly-check/domain';
import { filter, map } from 'rxjs';
import dayjs from 'dayjs';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';

export function monthlyCheckRedirect(): CanActivateFn {
  return (_route, state) => {
    // don't redirect if child route is navigated to, otherwise it would cause an infinite loop
    if (state.url !== '/monthly-check') {
      return true;
    }

    const facade = inject(MonthlyCheckFacade);
    const router = inject(Router);

    facade.getCurrentWeek();

    return facade.currentWeek$.pipe(
      filter((week) => !!week),
      map((week) => {
        const currentMonth = week.month;
        const month = dayjs(currentMonth).format('MM');
        const year = dayjs(currentMonth).format('YYYY');
        return new RedirectCommand(
          router.parseUrl(`monthly-check/${year}/${month}`)
        );
      })
    );
  };
}
