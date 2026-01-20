import { Week } from '../entities/weekly-check.model';
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

interface State {
  weeklyChecks: Week[];
  loadProcessStatus: ProcessStatus;
}

export const WeeklyCheckStore = signalStore(
  withDevtools('weekly-check', withGlitchTracking()),
  withState<State>({
    weeklyChecks: [],
    loadProcessStatus: 'init',
  }),
  withEventHandlers(() => weeklyCheckEffects()),
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
    })
  )
);
