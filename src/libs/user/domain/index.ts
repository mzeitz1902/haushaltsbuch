import { UsersDataService } from './infrastructure/users.data.service';
import { UsersFacade } from './application/users.facade';
import { UsersStore } from './+state/users.store';

export * from './application/users.facade';

export function provideUsersDomain() {
  return [UsersDataService, UsersFacade, UsersStore];
}
