import { inject, Injectable } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { monthlyCheckEvents } from '../+state/monthly-check.events';
import { monthlyCheckStore } from '../+state/monthly-check.store';

@Injectable()
export class MonthlyCheckFacade {
  private readonly dispatcher = inject(Dispatcher);
  private readonly store = inject(monthlyCheckStore);

  createMonth(month: string) {
    this.dispatcher.dispatch(monthlyCheckEvents.create(month));
  }
}
