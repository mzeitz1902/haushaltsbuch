import { Injectable } from '@angular/core';
import { supabase } from '@haushaltsbuch/shared/sdks';
import { from } from 'rxjs';

@Injectable()
export class MonthlyCheckDataService {
  createMonth(month: string) {
    return from(supabase.functions.invoke(''));
  }
}
