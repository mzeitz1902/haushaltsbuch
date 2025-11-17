import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { on, withEffects, withReducer } from '@ngrx/signals/events';
import { fixedCostsEffects } from './fixed-costs.effects';
import { fixedCostsEvents } from './fixed-costs.events';
import { FixedCost } from '../entities/fixed-cost.model';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';

interface State {
  fixedCosts: FixedCost[];
  loadProcessStatus: ProcessStatus;
  addProcessStatus: ProcessStatus;
  saveProcessStatus: ProcessStatus;
}

export const FixedCostsStore = signalStore(
  withDevtools('fixed-costs'),
  withState<State>({
    fixedCosts: new Array<FixedCost>(),
    loadProcessStatus: 'init',
    saveProcessStatus: 'init',
    addProcessStatus: 'init',
  }),
  withEffects(() => fixedCostsEffects()),
  withReducer(
    on(fixedCostsEvents.load, () => ({ loadProcessStatus: 'pending' })),
    on(fixedCostsEvents.loadSuccess, ({ payload: fixedCosts }) => ({
      fixedCosts: fixedCosts ?? [],
      loadProcessStatus: 'success',
    })),

    on(fixedCostsEvents.add, () => ({ addProcessStatus: 'pending' })),
    on(fixedCostsEvents.addSuccess, ({ payload: fixedCosts }, state) => ({
      fixedCosts: state.fixedCosts.concat(fixedCosts),
      addProcessStatus: 'success',
    })),

    on(fixedCostsEvents.update, () => ({ saveProcessStatus: 'pending' })),
    on(fixedCostsEvents.updateSuccess, ({ payload: fixedCosts }, state) => ({
      fixedCosts: state.fixedCosts.map((r) =>
        r.id === fixedCosts.id ? fixedCosts : r
      ),
      saveProcessStatus: 'success',
    })),

    on(fixedCostsEvents.deleteSuccess, ({ payload: id }, state) => ({
      fixedCosts: state.fixedCosts.filter((r) => r.id !== id),
    }))
  )
);
