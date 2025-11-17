import { inject, Injectable } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { usersEvents } from '../+state/users.events';
import { UsersStore } from '../+state/users.store';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class UsersFacade {
  private readonly dispatcher = inject(Dispatcher);
  private readonly store = inject(UsersStore);

  user = this.store.user;
  isLoggedIn = this.store.isLoggedIn;
  loginError = this.store.loginError;

  loadProcessStatus$ = toObservable(this.store.loadProcessStatus);

  getUser() {
    this.dispatcher.dispatch(usersEvents.getUser());
  }

  login(email: string, password: string) {
    this.dispatcher.dispatch(usersEvents.login({ email, password }));
  }

  logout() {
    this.dispatcher.dispatch(usersEvents.logout());
  }
}
