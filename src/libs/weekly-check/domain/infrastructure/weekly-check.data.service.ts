import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Week, WeeklyCheckShops } from '../entities/weekly-check.model';
import { supabase } from '@haushaltsbuch/shared/sdks';

@Injectable()
export class WeeklyCheckDataService {
  getWeeklyChecks(): Observable<Week[] | null> {
    return from(supabase.from('weekly_check').select('*').order('id')).pipe(
      map((res) => res.data ?? null)
    );
  }

  addHistoryEntry(id: number, column: keyof WeeklyCheckShops) {
    return from(
      supabase.rpc('append_weekly_check_history', {
        p_weekly_check_id: id,
        p_shop_column: column,
      })
    );
  }
}
