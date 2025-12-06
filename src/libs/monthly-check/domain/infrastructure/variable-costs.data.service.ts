import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import {
  AddVariableCostResponse,
  ChangeVariableCostResponse,
  HistoryEntry,
  HistoryPayload,
  VariableCost,
} from '../entities/monthly-check.model';
import { supabase } from '@haushaltsbuch/shared/sdks';
import { Json } from '../../../shared/sdks/model/database';

@Injectable()
export class VariableCostsDataService {
  addVariableCost(monthId: string): Observable<AddVariableCostResponse> {
    return from(
      supabase
        .rpc('add_monthly_snapshot_variable_costs_line', {
          p_snapshot_id: monthId,
          p_line: { value: 0, category: '', forecast: 0, history: [] },
        })
        .select('*')
        .single()
    ).pipe(
      map((res) => {
        return {
          variableCost: res.data!.retval_line as unknown as VariableCost,
          total: res.data!.retval_variable_costs_total,
        };
      })
    );
  }

  updateVariableCost(
    monthId: string,
    variableCost: VariableCost
  ): Observable<ChangeVariableCostResponse> {
    return from(
      supabase
        .rpc('update_monthly_snapshot_variable_costs_line', {
          p_snapshot_id: monthId,
          p_line_id: variableCost.id.toString(),
          p_new_values: {
            value: variableCost.value,
            category: variableCost.category,
            forecast: variableCost.forecast,
          },
        })
        .select('*')
        .single()
    ).pipe(
      map((res) => ({
        variableCosts: res.data!
          .variable_costs_lines as unknown as VariableCost[],
        total: res.data!.variable_costs_total,
      }))
    );
  }

  deleteVariableCost(
    monthId: string,
    variableCostId: number
  ): Observable<ChangeVariableCostResponse> {
    return from(
      supabase
        .rpc('delete_monthly_snapshot_variable_costs_line', {
          p_snapshot_id: monthId,
          p_line_id: variableCostId.toString(),
        })
        .select('*')
        .single()
    ).pipe(
      map((res) => ({
        variableCosts: res.data!
          .retval_variable_costs as unknown as VariableCost[],
        total: res.data!.retval_variable_costs_total,
      }))
    );
  }

  addVariableCostHistoryEntry(
    monthId: string,
    variableCostId: string
  ): Observable<ChangeVariableCostResponse> {
    const historyEntry: HistoryPayload = {
      date: new Date(),
      value: 0,
    };
    return from(
      supabase
        .rpc('update_monthly_snapshot_variable_costs_line', {
          p_snapshot_id: monthId,
          p_line_id: variableCostId,
          p_new_values: {
            history: historyEntry,
          } as unknown as Json,
        })
        .select('*')
        .single()
    ).pipe(
      map((res) => ({
        variableCosts: res.data!
          .variable_costs_lines as unknown as VariableCost[],
        total: res.data!.variable_costs_total,
      }))
    );
  }

  updateVariableCostHistoryEntry(
    monthId: string,
    variableCostId: string,
    history: HistoryEntry
  ): Observable<ChangeVariableCostResponse> {
    return from(
      supabase
        .rpc('update_variable_costs_history_entry', {
          p_snapshot_id: monthId,
          p_line_id: variableCostId,
          p_history_item: history as unknown as Json,
        })
        .select('*')
        .single()
    ).pipe(
      map((res) => ({
        variableCosts: res.data!
          .variable_costs_lines as unknown as VariableCost[],
        total: res.data!.variable_costs_total,
      }))
    );
  }

  deleteVariableCostHistoryEntry(
    monthId: string,
    variableCostId: string,
    historyId: string
  ): Observable<ChangeVariableCostResponse> {
    return from(
      supabase
        .rpc('delete_monthly_snapshot_variable_costs_history_entry', {
          p_history_item_id: historyId,
          p_line_id: variableCostId,
          p_snapshot_id: monthId,
        })
        .select('*')
        .single()
    ).pipe(
      map((res) => ({
        variableCosts: res.data!
          .out_variable_costs_lines as unknown as VariableCost[],
        total: res.data!.out_variable_costs_total,
      }))
    );
  }
}
