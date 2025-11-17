import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsersFacade } from '@haushaltsbuch/user/domain';
import { filter, map } from 'rxjs';

export const loginRedirectGuard: CanActivateFn = () => {
  const usersFacade = inject(UsersFacade);
  const router = inject(Router);
  const loadProcessStatus$ = usersFacade.loadProcessStatus$;
  return loadProcessStatus$.pipe(
    filter((value) => value === 'success'),
    map(() => {
      if (usersFacade.user() !== null) {
        return new RedirectCommand(router.parseUrl('/base'));
      }
      return true;
    })
  );
};
