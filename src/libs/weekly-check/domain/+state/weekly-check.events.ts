import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import { Week, WeeklyCheckShops } from '../entities/weekly-check.model';

const events = eventGroup({
  source: 'Weekly Check',
  events: {
    load: type<void>(),
    loadSuccess: type<Week[] | null>(),

    setCurrentHistoryInformation: type<{
      weeklyCheckId: number;
      shop: keyof WeeklyCheckShops;
    }>(),

    addHistoryEntry: type<{
      weeklyCheckId: number;
      column: keyof WeeklyCheckShops;
    }>(),
    addHistoryEntrySuccess: type<void>(),
  },
});

export const weeklyCheckEvents = {
  load: events.load,
  loadSuccess: events.loadSuccess,

  setCurrentHistoryInformation: events.setCurrentHistoryInformation,

  addHistoryEntry: events.addHistoryEntry,
  addHistoryEntrySuccess: events.addHistoryEntrySuccess,
};
