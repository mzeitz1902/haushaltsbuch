import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import {
  AddFixedCostResponse,
  AddRevenueResponse,
  ChangeFixedCostResponse,
  ChangeRevenueResponse,
  Month,
} from '@haushaltsbuch/monthly-check/domain';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import { FixedCost } from '@haushaltsbuch/fixed-costs/domain';

const events = eventGroup({
  source: 'Monthly Check',
  events: {
    create: type<string>(),
    createSuccess: type<unknown>(),
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
};
