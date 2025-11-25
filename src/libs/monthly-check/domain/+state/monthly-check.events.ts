import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import { Month } from '@haushaltsbuch/monthly-check/domain';
import { Revenue } from '@haushaltsbuch/revenue/domain';

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
    addRevenueSuccess: type<Revenue[]>(),
    addRevenueFailure: type<unknown>(),

    updateRevenue: type<{ revenue: Revenue; monthId: string }>(),
    updateRevenueSuccess: type<Revenue[]>(),
    updateRevenueFailure: type<unknown>(),

    deleteRevenue: type<{ monthId: string; revenueId: number }>(),
    deleteRevenueSuccess: type<Revenue[]>(),
    deleteRevenueFailure: type<unknown>(),
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
};
