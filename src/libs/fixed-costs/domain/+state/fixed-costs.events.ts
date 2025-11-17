import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import {
  AddFixedCostPayload,
  FixedCost,
  UpdateFixedCostPayload,
} from '../entities/fixed-cost.model';

const events = eventGroup({
  source: 'Fixed Costs',
  events: {
    load: type<void>(),
    loadSuccess: type<FixedCost[] | null>(),

    add: type<AddFixedCostPayload>(),
    addSuccess: type<FixedCost>(),
    addFailure: type<unknown>(),

    update: type<UpdateFixedCostPayload>(),
    updateSuccess: type<FixedCost>(),
    updateFailure: type<unknown>(),

    delete: type<number>(),
    deleteSuccess: type<number>(),
    deleteFailure: type<unknown>(),
  },
});

export const fixedCostsEvents = {
  load: events.load,
  loadSuccess: events.loadSuccess,

  add: events.add,
  addSuccess: events.addSuccess,
  addFailure: events.addFailure,

  update: events.update,
  updateSuccess: events.updateSuccess,
  updateFailure: events.updateFailure,

  delete: events.delete,
  deleteSuccess: events.deleteSuccess,
  deleteFailure: events.deleteFailure,
};
