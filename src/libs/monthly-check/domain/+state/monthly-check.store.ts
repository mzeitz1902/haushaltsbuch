import { Month } from '@haushaltsbuch/monthly-check/domain';
import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { on, withEffects, withReducer } from '@ngrx/signals/events';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';
import { monthlyCheckEvents } from './monthly-check.events';
import { monthlyCheckEffects } from './monthly-check.effects';

export interface MonthlyCheckState {
  month: Month | null;
  createdMonths: string[];
  createProcessStatus: ProcessStatus;
  getProcessStatus: ProcessStatus;
  saveRevenueProcessStatus: ProcessStatus;
  addRevenueProcessStatus: ProcessStatus;
  deleteRevenueProcessStatus: ProcessStatus;
}

export const monthlyCheckStore = signalStore(
  withDevtools('monthly-check'),
  withState<MonthlyCheckState>({
    month: null,
    createdMonths: [],
    createProcessStatus: 'init',
    getProcessStatus: 'init',
    saveRevenueProcessStatus: 'init',
    addRevenueProcessStatus: 'init',
    deleteRevenueProcessStatus: 'init',
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
    })),

    on(monthlyCheckEvents.updateRevenue, () => ({
      saveRevenueProcessStatus: 'pending',
    })),
    on(
      monthlyCheckEvents.updateRevenueSuccess,
      monthlyCheckEvents.addRevenueSuccess,
      monthlyCheckEvents.deleteRevenueSuccess,
      ({ payload: revenue }, { month }) => ({
        saveRevenueProcessStatus: 'success',
        month: {
          ...month,
          revenue_lines: revenue,
        } as Month,
      })
    ),
    on(monthlyCheckEvents.updateRevenueFailure, () => ({
      saveRevenueProcessStatus: 'error',
    }))
  )
);
