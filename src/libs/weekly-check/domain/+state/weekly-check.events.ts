import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import { Week } from '../entities/weekly-check.model';

const events = eventGroup({
  source: 'Weekly Check',
  events: {
    load: type<void>(),
    loadSuccess: type<Week[] | null>(),
  },
});

export const weeklyCheckEvents = {
  load: events.load,
  loadSuccess: events.loadSuccess,
};
