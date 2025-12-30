import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import {
  AddFixedCostResponse,
  AddRevenueResponse,
  AddVariableCostResponse,
  ChangeFixedCostResponse,
  ChangeRevenueResponse,
  ChangeVariableCostResponse,
  HistoryEntry,
  Month,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import { FixedCost } from '@haushaltsbuch/fixed-costs/domain';

const events = eventGroup({
  source: 'Monthly Check',
  events: {
    create: type<string>(),
    createSuccess: type<string>(),
    createFailure: type<unknown>(),

    getMonth: type<string>(),
    getMonthSuccess: type<Month>(),
    getMonthFailure: type<unknown>(),

    getCreatedMonths: type<void>(),
    getCreatedMonthsSuccess: type<string[]>(),
    getCreatedMonthsFailure: type<unknown>(),

    addRevenue: type<string>(),
    addRevenueSuccess: type<AddRevenueResponse>(),
    addRevenueFailure: type<unknown>(),

    updateRevenue: type<{ revenue: Revenue; monthId: string }>(),
    updateRevenueSuccess: type<ChangeRevenueResponse>(),
    updateRevenueFailure: type<unknown>(),

    deleteRevenue: type<{ monthId: string; revenueId: number }>(),
    deleteRevenueSuccess: type<ChangeRevenueResponse>(),
    deleteRevenueFailure: type<unknown>(),

    addFixedCost: type<string>(),
    addFixedCostSuccess: type<AddFixedCostResponse>(),
    addFixedCostFailure: type<unknown>(),

    updateFixedCost: type<{ fixedCost: FixedCost; monthId: string }>(),
    updateFixedCostSuccess: type<ChangeFixedCostResponse>(),
    updateFixedCostFailure: type<unknown>(),

    deleteFixedCost: type<{ monthId: string; fixedCostId: number }>(),
    deleteFixedCostSuccess: type<ChangeFixedCostResponse>(),
    deleteFixedCostFailure: type<unknown>(),

    addVariableCost: type<string>(),
    addVariableCostSuccess: type<AddVariableCostResponse>(),
    addVariableCostFailure: type<unknown>(),

    updateVariableCost: type<{ variableCost: VariableCost; monthId: string }>(),
    updateVariableCostSuccess: type<ChangeVariableCostResponse>(),
    updateVariableCostFailure: type<unknown>(),

    deleteVariableCost: type<{ monthId: string; variableCostId: number }>(),
    deleteVariableCostSuccess: type<ChangeVariableCostResponse>(),
    deleteVariableCostFailure: type<unknown>(),

    addVariableCostHistoryEntry: type<{
      variableCostId: string;
      monthId: string;
    }>(),
    addVariableCostHistoryEntrySuccess: type<ChangeVariableCostResponse>(),
    addVariableCostHistoryEntryFailure: type<unknown>(),

    removeVariableCostHistoryEntry: type<{
      monthId: string;
      variableCostId: string;
      entryId: string;
    }>(),
    removeVariableCostHistoryEntrySuccess: type<ChangeVariableCostResponse>(),
    removeVariableCostHistoryEntryFailure: type<unknown>(),

    deleteVariableCostHistoryEntry: type<{
      monthId: string;
      variableCostId: string;
      entryId: string;
    }>(),
    deleteVariableCostHistoryEntrySuccess: type<ChangeVariableCostResponse>(),
    deleteVariableCostHistoryEntryFailure: type<unknown>(),

    updateVariableCostHistoryEntry: type<{
      monthId: string;
      variableCostId: string;
      entry: HistoryEntry;
    }>(),
    updateVariableCostHistoryEntrySuccess: type<ChangeVariableCostResponse>(),
    updateVariableCostHistoryEntryFailure: type<unknown>(),

    addBudget: type<string>(),
    addBudgetSuccess: type<string>(),
    addBudgetFailure: type<unknown>(),
  },
});

export const monthlyCheckEvents = {
  create: events.create,
  createSuccess: events.createSuccess,
  createFailure: events.createFailure,

  getMonth: events.getMonth,
  getMonthSuccess: events.getMonthSuccess,
  getMonthFailure: events.getMonthFailure,

  getCreatedMonths: events.getCreatedMonths,
  getCreatedMonthsSuccess: events.getCreatedMonthsSuccess,
  getCreatedMonthsFailure: events.getCreatedMonthsFailure,

  addRevenue: events.addRevenue,
  addRevenueSuccess: events.addRevenueSuccess,
  addRevenueFailure: events.addRevenueFailure,

  updateRevenue: events.updateRevenue,
  updateRevenueSuccess: events.updateRevenueSuccess,
  updateRevenueFailure: events.updateRevenueFailure,

  deleteRevenue: events.deleteRevenue,
  deleteRevenueSuccess: events.deleteRevenueSuccess,
  deleteRevenueFailure: events.deleteRevenueFailure,

  addFixedCost: events.addFixedCost,
  addFixedCostSuccess: events.addFixedCostSuccess,
  addFixedCostFailure: events.addFixedCostFailure,

  updateFixedCost: events.updateFixedCost,
  updateFixedCostSuccess: events.updateFixedCostSuccess,
  updateFixedCostFailure: events.updateFixedCostFailure,

  deleteFixedCost: events.deleteFixedCost,
  deleteFixedCostSuccess: events.deleteFixedCostSuccess,
  deleteFixedCostFailure: events.deleteFixedCostFailure,

  addVariableCost: events.addVariableCost,
  addVariableCostSuccess: events.addVariableCostSuccess,
  addVariableCostFailure: events.addVariableCostFailure,

  updateVariableCost: events.updateVariableCost,
  updateVariableCostSuccess: events.updateVariableCostSuccess,
  updateVariableCostFailure: events.updateVariableCostFailure,

  deleteVariableCost: events.deleteVariableCost,
  deleteVariableCostSuccess: events.deleteVariableCostSuccess,
  deleteVariableCostFailure: events.deleteVariableCostFailure,

  addVariableCostHistoryEntry: events.addVariableCostHistoryEntry,
  addVariableCostHistoryEntrySuccess: events.addVariableCostHistoryEntrySuccess,
  addVariableCostHistoryEntryFailure: events.addVariableCostHistoryEntryFailure,

  deleteVariableCostHistoryEntry: events.deleteVariableCostHistoryEntry,
  deleteVariableCostHistoryEntrySuccess:
    events.deleteVariableCostHistoryEntrySuccess,
  deleteVariableCostHistoryEntryFailure:
    events.deleteVariableCostHistoryEntryFailure,

  updateVariableCostHistoryEntry: events.updateVariableCostHistoryEntry,
  updateVariableCostHistoryEntrySuccess:
    events.updateVariableCostHistoryEntrySuccess,
  updateVariableCostHistoryEntryFailure:
    events.updateVariableCostHistoryEntryFailure,

  addBudget: events.addBudget,
  addBudgetSuccess: events.addBudgetSuccess,
  addBudgetFailure: events.addBudgetFailure,
};
