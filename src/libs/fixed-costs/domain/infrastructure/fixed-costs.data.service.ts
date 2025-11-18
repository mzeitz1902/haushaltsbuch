import { Injectable } from '@angular/core';
import { supabase } from '@haushaltsbuch/shared/sdks';
import { from, map, Observable } from 'rxjs';
import {
  AddFixedCostPayload,
  FixedCost,
  UpdateFixedCostPayload,
} from '../entities/fixed-cost.model';
import { toNormalizedMoneyValue } from '@haushaltsbuch/shared/util-functions';

@Injectable()
export class FixedCostsDataService {
  getFixedCosts(): Observable<FixedCost[] | null> {
    return from(supabase.from('fixed_costs').select('*').order('id')).pipe(
      map((res) => res.data?.map(toNormalizedMoneyValue) ?? null)
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
