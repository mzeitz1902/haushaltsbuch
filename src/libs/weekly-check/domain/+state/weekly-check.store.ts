import { Week, WeeklyCheckShops } from '../entities/weekly-check.model';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';
import {
  withDevtools,
  withGlitchTracking,
  withTrackedReducer,
} from '@angular-architects/ngrx-toolkit';
import { signalStore, withState } from '@ngrx/signals';
import { on, withEventHandlers } from '@ngrx/signals/events';
import { weeklyCheckEvents } from './weekly-check.events';
import { weeklyCheckEffects } from './weekly-check.effects';

export interface WeeklyCheckState {
  weeklyChecks: Week[];
  loadProcessStatus: ProcessStatus;
  currentWeekId: number | null; // needed for history
  currentShop: keyof WeeklyCheckShops | null; // needed for history
}

export const WeeklyCheckStore = signalStore(
  withDevtools('weekly-check', withGlitchTracking()),
  withState<WeeklyCheckState>({
    weeklyChecks: [],
    loadProcessStatus: 'init',
    currentWeekId: null,
    currentShop: null,
  }),
  withEventHandlers((store) => weeklyCheckEffects(store)),
  withTrackedReducer(
    on(weeklyCheckEvents.load, () => ({
      loadProcessStatus: 'pending' as ProcessStatus,
    })),
    on(weeklyCheckEvents.loadSuccess, ({ payload: weeklyChecks }, state) => {
      if (!weeklyChecks) return state;

      return {
        weeklyChecks,
        loadProcessStatus: 'success' as ProcessStatus,
      };
    }),

    on(
      weeklyCheckEvents.setCurrentHistoryInformation,
      ({ payload: { weeklyCheckId, shop } }) => ({
        currentWeekId: weeklyCheckId,
        currentShop: shop,
      })
    )
  )
);
