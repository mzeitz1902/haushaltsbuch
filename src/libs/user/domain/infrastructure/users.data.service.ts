import { Injectable } from '@angular/core';
import { from, map, take } from 'rxjs';
import { supabase } from '@haushaltsbuch/shared/sdks';

@Injectable()
export class UsersDataService {
  getUser() {
    return from(supabase.auth.getUser()).pipe(
      map(({ data }) => data.user ?? null),
      take(1)
    );
  }

  login(email: string, password: string) {
    return from(
      supabase.auth.signInWithPassword({
        email,
        password,
      })
    ).pipe(
      take(1),
      map((res) => {
        if (res.error) throw res.error;
        return res;
      })
    );
  }

  logout() {
    return from(supabase.auth.signOut());
  }
}
