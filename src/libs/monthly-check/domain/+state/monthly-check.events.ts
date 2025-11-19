import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';

const events = eventGroup({
  source: 'Monthly Check',
  events: {
    create: type<string>(),
    createSuccess: type<unknown>(),
    createFailure: type<unknown>(),
  },
});

export const monthlyCheckEvents = {
  create: events.create,
  createSuccess: events.createSuccess,
  createFailure: events.createFailure,
};
