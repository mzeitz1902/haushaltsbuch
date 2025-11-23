import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { on, withEffects, withReducer } from '@ngrx/signals/events';
import { fixedCostsEffects } from './fixed-costs.effects';
import { fixedCostsEvents } from './fixed-costs.events';
import { FixedCost } from '../entities/fixed-cost.model';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';

interface State {
  fixedCosts: FixedCost[];
  quarterlyCosts: FixedCost[];
  specialCosts: FixedCost[];
  loadProcessStatus: ProcessStatus;
  addFixedProcessStatus: ProcessStatus;
  addQuarterlyProcessStatus: ProcessStatus;
  addSpecialProcessStatus: ProcessStatus;
  saveProcessStatus: ProcessStatus;
}

export const FixedCostsStore = signalStore(
  withDevtools('fixed-costs'),
  withState<State>({
    fixedCosts: [],
    quarterlyCosts: [],
    specialCosts: [],
    loadProcessStatus: 'init',
    saveProcessStatus: 'init',
    addFixedProcessStatus: 'init',
    addQuarterlyProcessStatus: 'init',
    addSpecialProcessStatus: 'init',
  }),
  withEffects(() => fixedCostsEffects()),
  withReducer(
    on(fixedCostsEvents.load, () => ({ loadProcessStatus: 'pending' })),
    on(fixedCostsEvents.loadSuccess, ({ payload: fixedCosts }) => ({
      fixedCosts: fixedCosts?.filter((el) => el.due_in === 'Alle') ?? [],
      quarterlyCosts: fixedCosts?.filter((el) => el.due_in === 'Quartal') ?? [],
      specialCosts: fixedCosts?.filter((el) => el.due_in === 'Sonder') ?? [],
      loadProcessStatus: 'success',
    })),

    on(fixedCostsEvents.add, ({ payload: { due_in } }) => {
      switch (due_in) {
        case 'Quartal':
          return { addQuarterlyProcessStatus: 'pending' };
        case 'Alle':
          return { addFixedProcessStatus: 'pending' };
        case 'Sonder':
          return { addSpecialProcessStatus: 'pending' };
        default:
          return {};
      }
    }),
    on(fixedCostsEvents.addSuccess, ({ payload: fixedCosts }, state) => {
      if (fixedCosts.due_in === 'Quartal') {
        return {
          quarterlyCosts: state.quarterlyCosts.concat(fixedCosts),
          addQuarterlyProcessStatus: 'success',
        };
      }
      if (fixedCosts.due_in === 'Sonder') {
        return {
          specialCosts: state.specialCosts.concat(fixedCosts),
          addSpecialProcessStatus: 'success',
        };
      }
      return {
        fixedCosts: state.fixedCosts.concat(fixedCosts),
        addFixedProcessStatus: 'success',
      };
    }),

    on(fixedCostsEvents.update, () => ({ saveProcessStatus: 'pending' })),
    on(fixedCostsEvents.updateSuccess, ({ payload: fixedCosts }, state) => {
      if (fixedCosts.due_in === 'Quartal') {
        return {
          quarterlyCosts: state.quarterlyCosts.map((r) =>
            r.id === fixedCosts.id ? fixedCosts : r
          ),
          saveProcessStatus: 'success',
        };
      }
      if (fixedCosts.due_in === 'Sonder') {
        return {
          specialCosts: state.specialCosts.map((r) =>
            r.id === fixedCosts.id ? fixedCosts : r
          ),
          saveProcessStatus: 'success',
        };
      }
      return {
        fixedCosts: state.fixedCosts.map((r) =>
          r.id === fixedCosts.id ? fixedCosts : r
        ),
        saveProcessStatus: 'success',
      };
    }),

    on(fixedCostsEvents.deleteSuccess, ({ payload: { id, dueIn } }, state) => {
      switch (dueIn) {
        case 'Quartal':
          return {
            quarterlyCosts: state.quarterlyCosts.filter((r) => r.id !== id),
          };
        case 'Sonder':
          return {
            specialCosts: state.specialCosts.filter((r) => r.id !== id),
          };
        default:
          return { fixedCosts: state.fixedCosts.filter((r) => r.id !== id) };
      }
    })
  )
);
