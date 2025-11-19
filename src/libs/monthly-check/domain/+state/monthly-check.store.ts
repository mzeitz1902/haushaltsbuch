import { Month } from '@haushaltsbuch/monthly-check/domain';
import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { on, withEffects, withReducer } from '@ngrx/signals/events';
import { monthlyCheckEffects } from './monthly-check.effects';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';
import { monthlyCheckEvents } from './monthly-check.events';

interface State {
  month: Month | null;
  createProcessStatus: ProcessStatus;
}

export const monthlyCheckStore = signalStore(
  withDevtools('monthly-check'),
  withState<State>({ month: null, createProcessStatus: 'init' }),
  withEffects(() => monthlyCheckEffects()),
  withReducer(
    on(monthlyCheckEvents.create, () => ({ createProcessStatus: 'pending' })),
    on(monthlyCheckEvents.createSuccess, () => ({
      createProcessStatus: 'success',
    }))
  )
);
