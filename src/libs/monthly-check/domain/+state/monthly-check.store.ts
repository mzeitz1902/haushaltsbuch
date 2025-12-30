import { Month, VariableCost } from '@haushaltsbuch/monthly-check/domain';
import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { monthlyCheckEvents } from './monthly-check.events';
import { monthlyCheckEffects } from './monthly-check.effects';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import { FixedCost } from '@haushaltsbuch/fixed-costs/domain';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';

export interface MonthlyCheckState {
  month: Month | null;
  createdMonths: string[];
  createProcessStatus: ProcessStatus;
  getCreatedMonthsProcessStatus: ProcessStatus;
  getMonthProcessStatus: ProcessStatus;
  saveRevenueProcessStatus: ProcessStatus;
  addRevenueProcessStatus: ProcessStatus;
  deleteRevenueProcessStatus: ProcessStatus;
  saveFixedCostProcessStatus: ProcessStatus;
  addFixedCostProcessStatus: ProcessStatus;
  deleteFixedCostProcessStatus: ProcessStatus;
  saveVariableCostProcessStatus: ProcessStatus;
  addVariableCostProcessStatus: ProcessStatus;
  deleteVariableCostProcessStatus: ProcessStatus;
  addHistoryEntryProcessStatus: ProcessStatus;
  addBudgetProcessStatus: ProcessStatus;
}

export const monthlyCheckStore = signalStore(
  withDevtools('monthly-check'),
  withState<MonthlyCheckState>({
    month: null,
    createdMonths: [],
    createProcessStatus: 'init',
    getMonthProcessStatus: 'init',
    getCreatedMonthsProcessStatus: 'init',
    saveRevenueProcessStatus: 'init',
    addRevenueProcessStatus: 'init',
    deleteRevenueProcessStatus: 'init',
    saveFixedCostProcessStatus: 'init',
    addFixedCostProcessStatus: 'init',
    deleteFixedCostProcessStatus: 'init',
    saveVariableCostProcessStatus: 'init',
    addVariableCostProcessStatus: 'init',
    deleteVariableCostProcessStatus: 'init',
    addHistoryEntryProcessStatus: 'init',
    addBudgetProcessStatus: 'init',
  }),
  withEventHandlers((store) => monthlyCheckEffects(store)),
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
      getCreatedMonthsProcessStatus: 'success',
    })),

    on(monthlyCheckEvents.getMonth, () => ({
      getMonthProcessStatus: 'pending',
    })),
    on(monthlyCheckEvents.getMonthSuccess, ({ payload: month }) => ({
      month,
      getMonthProcessStatus: 'success',
    })),
    on(monthlyCheckEvents.getMonthFailure, () => ({
      getMonthProcessStatus: 'error',
    })),

    on(monthlyCheckEvents.updateRevenue, () => ({
      saveRevenueProcessStatus: 'pending',
    })),
    on(
      monthlyCheckEvents.addRevenueSuccess,
      ({ payload: { revenue, total } }, { month }) => ({
        addRevenueProcessStatus: 'success',
        month: {
          ...month,
          revenue_lines: [...(month!.revenue_lines as Revenue[]), revenue],
          revenue_total: total,
        } as Month,
      })
    ),

    on(
      monthlyCheckEvents.updateRevenueSuccess,
      monthlyCheckEvents.deleteRevenueSuccess,
      ({ payload: { revenue, total } }, { month }) => ({
        saveRevenueProcessStatus: 'success',
        month: {
          ...month,
          revenue_lines: revenue,
          revenue_total: total,
        } as Month,
      })
    ),
    on(monthlyCheckEvents.updateRevenueFailure, () => ({
      saveRevenueProcessStatus: 'error',
    })),

    on(monthlyCheckEvents.updateFixedCost, () => ({
      saveFixedCostProcessStatus: 'pending',
    })),

    on(
      monthlyCheckEvents.addFixedCostSuccess,
      ({ payload: { fixedCost, total } }, { month }) => ({
        addFixedCostProcessStatus: 'success',
        month: {
          ...month,
          fixed_costs_lines: [
            ...(month!.fixed_costs_lines as FixedCost[]),
            fixedCost,
          ],
          fixed_costs_total: total,
        } as Month,
      })
    ),

    on(
      monthlyCheckEvents.updateFixedCostSuccess,
      monthlyCheckEvents.deleteFixedCostSuccess,
      ({ payload: { fixedCosts, total } }, { month }) => {
        return {
          saveFixedCostProcessStatus: 'success',
          month: {
            ...month,
            fixed_costs_lines: fixedCosts,
            fixed_costs_total: total,
          } as Month,
        };
      }
    ),
    on(monthlyCheckEvents.updateFixedCostFailure, () => ({
      saveFixedCostProcessStatus: 'error',
    })),

    on(
      monthlyCheckEvents.addVariableCostSuccess,
      ({ payload: { variableCost, total } }, { month }) => {
        if (!month) return { month: null };
        let variableCosts: VariableCost[] = month.variable_costs_lines;
        if (variableCosts) {
          variableCosts = [...variableCosts, variableCost];
        }
        return {
          addFixedCostProcessStatus: 'success',
          month: {
            ...month,
            variable_costs_lines: variableCosts ?? [],
            variable_costs_total: total,
          } as Month,
        };
      }
    ),

    on(
      monthlyCheckEvents.updateVariableCostSuccess,
      monthlyCheckEvents.deleteVariableCostSuccess,
      monthlyCheckEvents.addVariableCostHistoryEntrySuccess,
      monthlyCheckEvents.deleteVariableCostHistoryEntrySuccess,
      monthlyCheckEvents.updateVariableCostHistoryEntrySuccess,
      ({ payload: { variableCosts, total } }, { month }) => {
        return {
          saveVariableCostProcessStatus: 'success',
          month: {
            ...month,
            variable_costs_lines: variableCosts,
            variable_costs_total: total,
          } as Month,
        };
      }
    ),
    on(monthlyCheckEvents.addVariableCostHistoryEntry, () => ({
      addHistoryEntryProcessStatus: 'pending',
    })),
    on(monthlyCheckEvents.addVariableCostHistoryEntrySuccess, () => ({
      addHistoryEntryProcessStatus: 'success',
    })),
    on(monthlyCheckEvents.updateVariableCostFailure, () => ({
      saveVariableCostProcessStatus: 'error',
    })),
    on(monthlyCheckEvents.addBudgetSuccess, () => ({
      addBudgetProcessStatus: 'success',
    }))
  )
);

type Derp = typeof monthlyCheckStore;
export type MonthlyCheckStore = InstanceType<Derp>;
