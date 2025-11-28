import { Injectable } from '@angular/core';
import { supabase } from '@haushaltsbuch/shared/sdks';
import { from, map, Observable } from 'rxjs';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import {
  AddFixedCostResponse,
  AddRevenueResponse,
  ChangeFixedCostResponse,
  ChangeRevenueResponse,
  Month,
} from '@haushaltsbuch/monthly-check/domain';
import { FixedCost } from '@haushaltsbuch/fixed-costs/domain';

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

  getMonth(month: string): Observable<Month> {
    return from(
      supabase.from('monthly_snapshots').select('*').eq('month', month).single()
    ).pipe(map((res) => res.data! as unknown as Month));
  }

  addRevenue(monthId: string): Observable<AddRevenueResponse> {
    return from(
      supabase.rpc('add_monthly_snapshot_revenue_line', {
        p_snapshot_id: monthId,
        p_line: { value: 0, category: '' },
      })
    ).pipe(
      map((res) => {
        return {
          revenue: res.data![0].retval_line as Revenue,
          total: res.data![0].retval_revenue_total,
        };
      })
    );
  }

  updateRevenue(
    monthId: string,
    revenue: Revenue
  ): Observable<ChangeRevenueResponse> {
    return from(
      supabase
        .rpc('update_monthly_snapshot_revenue_line', {
          p_snapshot_id: monthId,
          p_line_id: revenue.id.toString(),
          p_new_values: { value: revenue.value, category: revenue.category },
        })
        .select('*')
        .single()
    ).pipe(
      map((res) => ({
        revenue: res.data!.retval_revenue_lines as Revenue[],
        total: res.data!.retval_revenue_total,
      }))
    );
  }

  deleteRevenue(
    monthId: string,
    revenueId: number
  ): Observable<ChangeRevenueResponse> {
    return from(
      supabase
        .rpc('delete_monthly_snapshot_revenue_line', {
          p_snapshot_id: monthId,
          p_line_id: revenueId.toString(),
        })
        .select('*')
        .single()
    ).pipe(
      map((res) => ({
        revenue: res.data!.retval_revenue_lines as Revenue[],
        total: res.data!.retval_revenue_total,
      }))
    );
  }

  addFixedCost(monthId: string): Observable<AddFixedCostResponse> {
    return from(
      supabase.rpc('add_monthly_snapshot_fixed_costs_line', {
        p_snapshot_id: monthId,
        p_line: { value: 0, category: '' },
      })
    ).pipe(
      map((res) => {
        return {
          fixedCost: res.data![0].retval_line as FixedCost,
          total: res.data![0].retval_fixed_costs_total,
        };
      })
    );
  }

  updateFixedCost(
    monthId: string,
    fixedCost: FixedCost
  ): Observable<ChangeFixedCostResponse> {
    return from(
      supabase
        .rpc('update_monthly_snapshot_fixed_costs_line', {
          p_snapshot_id: monthId,
          p_line_id: fixedCost.id.toString(),
          p_new_values: {
            value: fixedCost.value,
            category: fixedCost.category,
          },
        })
        .select('*')
        .single()
    ).pipe(
      map((res) => ({
        fixedCosts: res.data!.retval_fixed_costs as FixedCost[],
        total: res.data!.retval_fixed_costs_total,
      }))
    );
  }

  deleteFixedCost(
    monthId: string,
    fixedCostId: number
  ): Observable<ChangeFixedCostResponse> {
    return from(
      supabase
        .rpc('delete_monthly_snapshot_fixed_costs_line', {
          p_snapshot_id: monthId,
          p_line_id: fixedCostId.toString(),
        })
        .select('*')
        .single()
    ).pipe(
      map((res) => ({
        fixedCosts: res.data!.retval_fixed_costs as FixedCost[],
        total: res.data!.retval_fixed_costs_total,
      }))
    );
  }
}
