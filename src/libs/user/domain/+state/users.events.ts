import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import { User } from '@supabase/supabase-js';

const events = eventGroup({
  source: 'Users',
  events: {
    getUser: type<void>(),
    getUserSuccess: type<User | null>(),
    getUserFailure: type<unknown>(),

    login: type<{ email: string; password: string }>(),
    loginSuccess: type<void>(),
    loginFailure: type<string>(),

    logout: type<void>(),
    logoutSuccess: type<void>(),
    logoutFailure: type<unknown>(),
  },
});

export const usersEvents = {
  getUser: events.getUser,
  getUserSuccess: events.getUserSuccess,
  getUserFailure: events.getUserFailure,

  login: events.login,
  loginSuccess: events.loginSuccess,
  loginFailure: events.loginFailure,

  logout: events.logout,
  logoutSuccess: events.logoutSuccess,
  logoutFailure: events.logoutFailure,
};
