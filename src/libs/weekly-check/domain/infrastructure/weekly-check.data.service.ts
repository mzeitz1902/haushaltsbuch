import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Week } from '../entities/weekly-check.model';
import { supabase } from '@haushaltsbuch/shared/sdks';

@Injectable()
export class WeeklyCheckDataService {
  getWeeklyChecks(): Observable<Week[] | null> {
    return from(supabase.from('weekly_check').select('*').order('id')).pipe(
      map((res) => res.data ?? null)
    );
  }

  addLidlHistoryEntry() {
    return from(supabase.from('weekly_check').update({ lidl: '' }));
  }
}
