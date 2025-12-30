import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { usersEvents } from './users.events';
import { User } from '@supabase/supabase-js';
import { usersEffects } from './users.effects';
import { ProcessStatus } from '@haushaltsbuch/shared/util-types';

interface State {
  user: User | null;
  loadProcessStatus: ProcessStatus;
  isLoggedIn: boolean;
  loginError: string | null;
}

export const UsersStore = signalStore(
  withDevtools('users'),
  withState<State>({
    user: null,
    loadProcessStatus: 'init',
    isLoggedIn: false,
    loginError: null,
  }),
  withEventHandlers(() => usersEffects()),
  withReducer(
    on(usersEvents.getUserSuccess, ({ payload: user }) => ({
      user: user ?? null,
      loadProcessStatus: 'success',
      isLoggedIn: user !== null,
    })),
    on(usersEvents.getUserFailure, () => ({
      loadProcessStatus: 'error',
    })),
    on(usersEvents.loginSuccess, () => ({
      isLoggedIn: true,
    })),
    on(usersEvents.loginFailure, ({ payload: error }) => ({
      loginError: error,
    })),
    on(usersEvents.logoutSuccess, () => ({
      isLoggedIn: false,
      user: null,
    }))
  )
);
