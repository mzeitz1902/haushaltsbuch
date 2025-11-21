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
      map((res) => res.data ?? null)
      // map((res) => res.data?.map((item) => toGermanMoney(item)) ?? null)
    );
  }

  addRevenue(payload: AddRevenuePayload): Observable<Revenue> {
    return from(
      supabase.from('revenue').insert(payload).select('*').single()
    ).pipe(map((res) => res.data!));
  }

  updateRevenue(payload: UpdateRevenuePayload): Observable<Revenue> {
    return from(
      supabase
        .from('revenue')
        .update({
          category: payload.category,
          value: payload.value,
          // value: toEnglishMoneyValue(payload.value),
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
