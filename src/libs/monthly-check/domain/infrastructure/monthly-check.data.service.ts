import { Injectable } from '@angular/core';
import { supabase } from '@haushaltsbuch/shared/sdks';
import { from, map } from 'rxjs';

@Injectable()
export class MonthlyCheckDataService {
  createMonth(month: string) {
    return from(
      supabase.rpc('create_monthly_snapshot', {
        p_month: month,
      })
    );
  }

  getCreatedMonths() {
    return from(supabase.from('monthly_snapshots').select('month')).pipe(
      map((res) => res.data?.map((item) => item.month) ?? [])
    );
  }

  getMonth(month: string) {
    return from(
      supabase.from('monthly_snapshots').select('*').eq('month', month).single()
    ).pipe(map((res) => res.data!));
  }
}
