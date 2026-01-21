import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import {
  Week,
  WeeklyCheckShops,
  WeeklyHistoryForm,
} from '../entities/weekly-check.model';
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

  deleteHistoryEntry(
    weeklyCheckId: number,
    historyId: string,
    shop: keyof WeeklyCheckShops
  ) {
    return from(
      supabase.rpc('delete_weekly_check_history', {
        p_history_id: historyId,
        p_shop: shop,
        p_weekly_check_id: weeklyCheckId,
      })
    );
  }

  updateHistoryEntry(
    weeklyCheckId: number,
    shop: keyof WeeklyCheckShops,
    { id, value, note }: WeeklyHistoryForm
  ) {
    return from(
      supabase.rpc('update_weekly_check_history', {
        p_weekly_check_id: weeklyCheckId,
        p_shop: shop,
        p_history_id: id,
        p_new_value: value,
        p_new_note: note,
      })
    );
  }
}
