import { UsersFacade } from '../libs/user/domain';
import { inject, provideAppInitializer } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';

export function initUsersFactory() {
  const usersFacade = inject(UsersFacade);
  usersFacade.getUser();

  return firstValueFrom(of(true));
}

export function provideAppInitializers() {
  return [provideAppInitializer(() => initUsersFactory())];
}
