import { inject } from '@angular/core';
import { UsersDataService } from '../infrastructure/users.data.service';
import { Events } from '@ngrx/signals/events';
import { usersEvents } from './users.events';
import { map, switchMap, tap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import { AuthApiError } from '@supabase/supabase-js';

export function usersEffects() {
  const events = inject(Events);
  const dataService = inject(UsersDataService);
  const router = inject(Router);

  return {
    getUser$: events.on(usersEvents.getUser).pipe(
      switchMap(() =>
        dataService.getUser().pipe(
          mapResponse({
            next: (user) => usersEvents.getUserSuccess(user),
            error: (error) => usersEvents.getUserFailure(error),
          })
        )
      )
    ),

    login$: events.on(usersEvents.login).pipe(
      switchMap(({ payload: { email, password } }) =>
        dataService.login(email, password).pipe(
          mapResponse({
            next: () => usersEvents.loginSuccess(),
            error(error: AuthApiError) {
              return usersEvents.loginFailure(error.message);
            },
          })
        )
      )
    ),

    getUserOnLoginSuccess$: events
      .on(usersEvents.loginSuccess)
      .pipe(map(() => usersEvents.getUser())),

    navigateOnLoginSuccess$: events
      .on(usersEvents.loginSuccess)
      .pipe(tap(() => router.navigate(['/base']))),

    logout$: events.on(usersEvents.logout).pipe(
      switchMap(() =>
        dataService.logout().pipe(
          mapResponse({
            next: () => usersEvents.logoutSuccess(),
            error: (error) => usersEvents.logoutFailure(error),
          })
        )
      )
    ),

    navigateOnLogoutSuccess$: events
      .on(usersEvents.logoutSuccess)
      .pipe(tap(() => router.navigate(['/login']))),
  };
}
