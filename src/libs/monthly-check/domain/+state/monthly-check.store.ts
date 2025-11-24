import { Month } from '@haushaltsbuch/monthly-check/domain';
import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { on, withEffects, withReducer } from '@ngrx/signals/events';
import { monthlyCheckEffects } from './monthly-check.effects';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';
import { monthlyCheckEvents } from './monthly-check.events';

export interface State {
  month: Month | null;
  createdMonths: string[];
  createProcessStatus: ProcessStatus;
  getProcessStatus: ProcessStatus;
  saveProcessStatus: ProcessStatus;
  addRevenueProcessStatus: ProcessStatus;
}

export const monthlyCheckStore = signalStore(
  withDevtools('monthly-check'),
  withState<State>({
    month: null,
    createdMonths: [],
    createProcessStatus: 'init',
    getProcessStatus: 'init',
    saveProcessStatus: 'init',
    addRevenueProcessStatus: 'init',
  }),
  withEffects(() => monthlyCheckEffects()),
  withReducer(
    on(monthlyCheckEvents.create, () => ({ createProcessStatus: 'pending' })),
    on(monthlyCheckEvents.createSuccess, () => ({
      createProcessStatus: 'success',
    })),
    on(monthlyCheckEvents.createFailure, () => ({
      createProcessStatus: 'error',
    })),

    on(monthlyCheckEvents.getCreatedMonthsSuccess, ({ payload: months }) => ({
      createdMonths: months,
    })),

    on(monthlyCheckEvents.getMonth, () => ({ getProcessStatus: 'pending' })),
    on(monthlyCheckEvents.getMonthSuccess, ({ payload: month }) => ({
      month,
      getProcessStatus: 'success',
    })),
    on(monthlyCheckEvents.getMonthFailure, () => ({
      getProcessStatus: 'error',
    }))
  )
);
