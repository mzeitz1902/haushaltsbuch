import { signalStore, withState } from '@ngrx/signals';
import {
  withDevtools,
  withGlitchTracking,
  withTrackedReducer,
} from '@angular-architects/ngrx-toolkit';
import { on, withEventHandlers } from '@ngrx/signals/events';
import { revenueEffects } from './revenue.effects';
import { revenueEvents } from './revenue.events';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';

interface State {
  revenue: Revenue[];
  loadProcessStatus: ProcessStatus;
  addProcessStatus: ProcessStatus;
  saveProcessStatus: ProcessStatus;
}

export const RevenueStore = signalStore(
  withDevtools('revenue', withGlitchTracking()),
  withState<State>({
    revenue: new Array<Revenue>(),
    loadProcessStatus: 'init',
    saveProcessStatus: 'init',
    addProcessStatus: 'init',
  }),
  withEventHandlers(() => revenueEffects()),
  withTrackedReducer(
    on(revenueEvents.load, () => ({ loadProcessStatus: 'pending' })),
    on(revenueEvents.loadSuccess, ({ payload: revenue }) => ({
      revenue: revenue ?? [],
      loadProcessStatus: 'success',
    })),

    on(revenueEvents.add, () => ({ addProcessStatus: 'pending' })),
    on(revenueEvents.addSuccess, ({ payload: revenue }, state) => ({
      revenue: state.revenue.concat(revenue),
      addProcessStatus: 'success',
    })),

    on(revenueEvents.update, () => ({ saveProcessStatus: 'pending' })),
    on(revenueEvents.updateSuccess, ({ payload: revenue }, state) => ({
      revenue: state.revenue.map((r) => (r.id === revenue.id ? revenue : r)),
      saveProcessStatus: 'success',
    })),

    on(revenueEvents.deleteSuccess, ({ payload: id }, state) => ({
      revenue: state.revenue.filter((r) => r.id !== id),
    }))
  )
);
