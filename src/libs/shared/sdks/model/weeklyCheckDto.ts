import { Database } from './database-generated';
import { WeeklyCheckEntryDto } from './weeklyCheckEntryDto';

export interface WeeklyCheckDto {
  away: WeeklyCheckEntryDto;
  baker_butcher: WeeklyCheckEntryDto;
  cw: number;
  dateFrom: string;
  dateTo: string;
  drugstore: WeeklyCheckEntryDto;
  edeka: WeeklyCheckEntryDto;
  id: number;
  kaufland: WeeklyCheckEntryDto;
  lidl: WeeklyCheckEntryDto;
  misc: WeeklyCheckEntryDto;
  month: Database['public']['Enums']['month'];
  total: number;
}
