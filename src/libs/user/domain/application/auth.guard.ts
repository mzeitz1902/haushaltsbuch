import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { UsersFacade } from '@haushaltsbuch/user/domain';
import { inject } from '@angular/core';
import { filter, map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const usersFacade = inject(UsersFacade);
  const router = inject(Router);
  const loadProcessStatus$ = usersFacade.loadProcessStatus$;
  const loggedIn = usersFacade.isLoggedIn;
  if (loggedIn()) return true;
  return loadProcessStatus$.pipe(
    filter((value) => value === 'success'),
    map(() => {
      if (usersFacade.user() == null) {
        return new RedirectCommand(router.parseUrl('/login'));
      }
      return true;
    })
  );
};
