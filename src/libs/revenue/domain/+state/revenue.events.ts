import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import {
  AddRevenuePayload,
  Revenue,
  UpdateRevenuePayload,
} from '@haushaltsbuch/revenue/domain';

export const revenueEvents = eventGroup({
  source: 'Revenue',
  events: {
    load: type<void>(),
    loadSuccess: type<Revenue[] | null>(),

    add: type<AddRevenuePayload>(),
    addSuccess: type<Revenue>(),
    addFailure: type<unknown>(),

    update: type<UpdateRevenuePayload>(),
    updateSuccess: type<Revenue>(),
    updateFailure: type<unknown>(),

    delete: type<number>(),
    deleteSuccess: type<number>(),
    deleteFailure: type<unknown>(),
  },
});
