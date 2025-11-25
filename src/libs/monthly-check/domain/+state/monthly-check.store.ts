import { Month } from '@haushaltsbuch/monthly-check/domain';
import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { on, withReducer } from '@ngrx/signals/events';
import { withMonthlyCheckEffects } from './monthly-check.effects';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';
import { monthlyCheckEvents } from './monthly-check.events';

export interface State {
  month: Month | null;
  createdMonths: string[];
  createProcessStatus: ProcessStatus;
  getProcessStatus: ProcessStatus;
  saveRevenueProcessStatus: ProcessStatus;
  addRevenueProcessStatus: ProcessStatus;
}

export const monthlyCheckStore = signalStore(
  withDevtools('monthly-check'),
  withState<State>({
    month: null,
    createdMonths: [],
    createProcessStatus: 'init',
    getProcessStatus: 'init',
    saveRevenueProcessStatus: 'init',
    addRevenueProcessStatus: 'init',
  }),
  withMonthlyCheckEffects(),
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
    })),

    on(monthlyCheckEvents.updateRevenue, () => ({
      saveRevenueProcessStatus: 'pending',
    })),
    on(
      monthlyCheckEvents.updateRevenueSuccess,
      ({ payload: revenue }, { month }) => ({
        saveRevenueProcessStatus: 'success',
        month: {
          ...month,
          revenue_lines: revenue,
        } as Month,
      })
    )
  )
);
