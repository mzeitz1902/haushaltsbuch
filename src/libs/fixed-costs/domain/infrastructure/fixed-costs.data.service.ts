import { Injectable } from '@angular/core';
import { supabase } from '@haushaltsbuch/shared/sdks';
import { from, map, Observable } from 'rxjs';
import {
  AddFixedCostPayload,
  FixedCost,
  UpdateFixedCostPayload,
} from '../entities/fixed-cost.model';

@Injectable()
export class FixedCostsDataService {
  getFixedCosts(): Observable<FixedCost[] | null> {
    return from(supabase.from('fixed_costs').select('*').order('id')).pipe(
      map((res) => res.data ?? null)
    );
  }

  addFixedCost(payload: AddFixedCostPayload): Observable<FixedCost> {
    return from(
      supabase.from('fixed_costs').insert(payload).select('*').single()
    ).pipe(map((res) => res.data!));
  }

  updateFixedCost(payload: UpdateFixedCostPayload): Observable<FixedCost> {
    return from(
      supabase
        .from('fixed_costs')
        .update({
          category: payload.category,
          value: payload.value,
          due_in: payload.due_in,
          due_in_month: payload.due_in_month,
        })
        .eq('id', payload.id)
        .select('*')
        .single()
    ).pipe(map((res) => res.data!));
  }

  deleteFixedCost(id: number) {
    return from(supabase.from('fixed_costs').delete().eq('id', id));
  }
}
