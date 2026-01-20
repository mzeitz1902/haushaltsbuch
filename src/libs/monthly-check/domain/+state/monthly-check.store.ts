import { Month, VariableCost } from '@haushaltsbuch/monthly-check/domain';
import { signalStore, withState } from '@ngrx/signals';
import {
  withDevtools,
  withGlitchTracking,
  withTrackedReducer,
} from '@angular-architects/ngrx-toolkit';
import { on, withEventHandlers } from '@ngrx/signals/events';
import { monthlyCheckEvents } from './monthly-check.events';
import { monthlyCheckEffects } from './monthly-check.effects';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import { FixedCost } from '@haushaltsbuch/fixed-costs/domain';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';

// Add typed status constants to avoid "string is not assignable" issues
const INIT: ProcessStatus = 'init';
const PENDING: ProcessStatus = 'pending';
const SUCCESS: ProcessStatus = 'success';
const ERROR: ProcessStatus = 'error';

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
  withDevtools('monthly-check', withGlitchTracking()),
  withState<MonthlyCheckState>({
    month: null,
    createdMonths: [],
    createProcessStatus: INIT,
    getMonthProcessStatus: INIT,
    getCreatedMonthsProcessStatus: INIT,
    saveRevenueProcessStatus: INIT,
    addRevenueProcessStatus: INIT,
    deleteRevenueProcessStatus: INIT,
    saveFixedCostProcessStatus: INIT,
    addFixedCostProcessStatus: INIT,
    deleteFixedCostProcessStatus: INIT,
    saveVariableCostProcessStatus: INIT,
    addVariableCostProcessStatus: INIT,
    deleteVariableCostProcessStatus: INIT,
    addHistoryEntryProcessStatus: INIT,
    addBudgetProcessStatus: INIT,
  }),
  withEventHandlers((store) => monthlyCheckEffects(store)),
  withTrackedReducer(
    on(monthlyCheckEvents.create, () => ({ createProcessStatus: PENDING })),
    on(monthlyCheckEvents.createSuccess, () => ({
      createProcessStatus: SUCCESS,
    })),
    on(monthlyCheckEvents.createFailure, () => ({
      createProcessStatus: ERROR,
    })),

    on(monthlyCheckEvents.getCreatedMonthsSuccess, ({ payload: months }) => ({
      createdMonths: months,
      getCreatedMonthsProcessStatus: SUCCESS,
    })),

    on(monthlyCheckEvents.getMonth, () => ({
      getMonthProcessStatus: PENDING,
    })),
    on(monthlyCheckEvents.getMonthSuccess, ({ payload: month }) => ({
      month,
      getMonthProcessStatus: SUCCESS,
    })),
    on(monthlyCheckEvents.getMonthFailure, () => ({
      getMonthProcessStatus: ERROR,
    })),

    on(monthlyCheckEvents.updateRevenue, () => ({
      saveRevenueProcessStatus: PENDING,
    })),
    on(
      monthlyCheckEvents.addRevenueSuccess,
      ({ payload: { revenue, total } }, { month }) => ({
        addRevenueProcessStatus: SUCCESS,
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
        saveRevenueProcessStatus: SUCCESS,
        month: {
          ...month,
          revenue_lines: revenue,
          revenue_total: total,
        } as Month,
      })
    ),
    on(monthlyCheckEvents.updateRevenueFailure, () => ({
      saveRevenueProcessStatus: ERROR,
    })),

    on(monthlyCheckEvents.updateFixedCost, () => ({
      saveFixedCostProcessStatus: PENDING,
    })),

    on(
      monthlyCheckEvents.addFixedCostSuccess,
      ({ payload: { fixedCost, total } }, { month }) => ({
        addFixedCostProcessStatus: SUCCESS,
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
          saveFixedCostProcessStatus: SUCCESS,
          month: {
            ...month,
            fixed_costs_lines: fixedCosts,
            fixed_costs_total: total,
          } as Month,
        };
      }
    ),
    on(monthlyCheckEvents.updateFixedCostFailure, () => ({
      saveFixedCostProcessStatus: ERROR,
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
          addFixedCostProcessStatus: SUCCESS,
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
          saveVariableCostProcessStatus: SUCCESS,
          month: {
            ...month,
            variable_costs_lines: variableCosts,
            variable_costs_total: total,
          } as Month,
        };
      }
    ),
    on(
      monthlyCheckEvents.updateBudgetHistoryEntrySuccess,
      ({ payload: { budgets } }, { month }) => {
        return {
          month: {
            ...month,
            budget_lines: budgets,
          } as Month,
        };
      }
    ),
    on(
      monthlyCheckEvents.addVariableCostHistoryEntry,
      monthlyCheckEvents.addBudgetHistoryEntry,
      () => ({
        addHistoryEntryProcessStatus: PENDING,
      })
    ),
    on(
      monthlyCheckEvents.addVariableCostHistoryEntrySuccess,
      monthlyCheckEvents.addBudgetHistoryEntrySuccess,
      () => ({
        addHistoryEntryProcessStatus: SUCCESS,
      })
    ),
    on(
      monthlyCheckEvents.deleteBudgetHistoryEntry,
      monthlyCheckEvents.deleteVariableCostHistoryEntry,
      () => ({
        addHistoryEntryProcessStatus: INIT,
      })
    ),
    on(monthlyCheckEvents.updateVariableCostFailure, () => ({
      saveVariableCostProcessStatus: ERROR,
    })),
    on(monthlyCheckEvents.addBudgetSuccess, () => ({
      addBudgetProcessStatus: SUCCESS,
    }))
  )
);
