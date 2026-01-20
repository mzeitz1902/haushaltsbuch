import { signalStore, withState } from '@ngrx/signals';
import {
  withDevtools,
  withGlitchTracking,
  withTrackedReducer,
} from '@angular-architects/ngrx-toolkit';
import { on, withEventHandlers } from '@ngrx/signals/events';
import { fixedCostsEffects } from './fixed-costs.effects';
import { fixedCostsEvents } from './fixed-costs.events';
import { FixedCost } from '../entities/fixed-cost.model';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';

interface State {
  fixedCosts: FixedCost[];
  quarterlyCosts: FixedCost[];
  specialCosts: FixedCost[];
  budgets: FixedCost[];
  loadProcessStatus: ProcessStatus;
  addFixedProcessStatus: ProcessStatus;
  addQuarterlyProcessStatus: ProcessStatus;
  addSpecialProcessStatus: ProcessStatus;
  addBudgetProcessStatus: ProcessStatus;
  saveProcessStatus: ProcessStatus;
}

export const FixedCostsStore = signalStore(
  withDevtools('fixed-costs', withGlitchTracking()),
  withState<State>({
    fixedCosts: [],
    quarterlyCosts: [],
    specialCosts: [],
    budgets: [],
    loadProcessStatus: 'init',
    saveProcessStatus: 'init',
    addFixedProcessStatus: 'init',
    addQuarterlyProcessStatus: 'init',
    addSpecialProcessStatus: 'init',
    addBudgetProcessStatus: 'init',
  }),
  withEventHandlers(() => fixedCostsEffects()),
  withTrackedReducer(
    on(fixedCostsEvents.load, () => ({ loadProcessStatus: 'pending' })),
    on(fixedCostsEvents.loadSuccess, ({ payload: fixedCosts }, state) => {
      if (!fixedCosts) return state;

      const budgets = fixedCosts.filter((el) => el.type === 'Budget');
      const _fixedCosts = fixedCosts.filter((el) => el.type !== 'Budget');
      return {
        fixedCosts: _fixedCosts.filter((el) => el.due_in === 'Alle') ?? [],
        quarterlyCosts:
          _fixedCosts.filter((el) => el.due_in === 'Quartal') ?? [],
        specialCosts: _fixedCosts.filter((el) => el.due_in === 'Sonder') ?? [],
        budgets: budgets ?? [],
        loadProcessStatus: 'success',
      };
    }),

    on(fixedCostsEvents.add, ({ payload: { due_in, type } }) => {
      if (type === 'Budget') {
        return { addBudgetProcessStatus: 'pending' };
      }
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
      if (!fixedCosts) return state;

      if (fixedCosts.type === 'Budget') {
        return {
          budgets: state.budgets.concat(fixedCosts),
          addBudgetProcessStatus: 'success',
        };
      }
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
      if (!fixedCosts) return state;

      if (fixedCosts.type === 'Budget') {
        return {
          budgets: state.budgets.map((r) =>
            r.id === fixedCosts.id ? fixedCosts : r
          ),
          saveProcessStatus: 'success',
        };
      }
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

    on(
      fixedCostsEvents.deleteSuccess,
      ({ payload: { id, dueIn, type } }, state) => {
        if (type === 'Budget') {
          return {
            budgets: state.budgets.filter((r) => r.id !== id),
          };
        }
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
      }
    )
  )
);
