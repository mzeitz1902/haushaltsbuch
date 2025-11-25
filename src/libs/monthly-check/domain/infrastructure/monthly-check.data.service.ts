import { Injectable } from '@angular/core';
import { supabase } from '@haushaltsbuch/shared/sdks';
import { from, map } from 'rxjs';
import { Revenue } from '@haushaltsbuch/revenue/domain';

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

  addRevenue(monthId: string) {
    return from(
      supabase.rpc('add_monthly_snapshot_revenue_line', {
        p_snapshot_id: monthId,
        p_line: { value: 0, category: '' },
      })
    ).pipe(
      map((res) => res.data!.map((el) => el.retval_revenue_lines) as Revenue[])
    );
  }

  updateRevenue(monthId: string, revenue: Revenue) {
    return from(
      supabase
        .rpc('update_monthly_snapshot_revenue_line', {
          p_snapshot_id: monthId,
          p_line_id: revenue.id.toString(),
          p_new_values: { value: revenue.value, category: revenue.category },
        })
        .select('*')
        .single()
    ).pipe(map((res) => res.data!.retval_revenue_lines as Revenue[]));
  }

  deleteRevenue(monthId: string, revenueId: number) {
    return from(
      supabase
        .rpc('delete_monthly_snapshot_revenue_line', {
          p_snapshot_id: monthId,
          p_line_id: revenueId.toString(),
        })
        .select('*')
        .single()
    ).pipe(map((res) => res.data!.retval_revenue_lines as Revenue[]));
  }
}
