import { Injectable } from '@angular/core';
import { supabase } from '@haushaltsbuch/shared/sdks';
import { from, map, Observable } from 'rxjs';
import {
  AddRevenuePayload,
  Revenue,
  UpdateRevenuePayload,
} from '../entities/revenue.model';

@Injectable()
export class RevenueDataService {
  getRevenue(): Observable<Revenue[] | null> {
    return from(supabase.from('revenue').select('*').order('id')).pipe(
      map((res) => res.data)
    );
  }

  addRevenue(revenue: AddRevenuePayload): Observable<Revenue> {
    return from(
      supabase.from('revenue').insert(revenue).select('*').single()
    ).pipe(map((res) => res.data!));
  }

  updateRevenue(payload: UpdateRevenuePayload): Observable<Revenue> {
    return from(
      supabase
        .from('revenue')
        .update({
          category: payload.category,
          value: payload.value,
        })
        .eq('id', payload.id)
        .select('*')
        .single()
    ).pipe(map((res) => res.data!));
  }

  deleteRevenue(id: number) {
    return from(supabase.from('revenue').delete().eq('id', id));
  }
}
