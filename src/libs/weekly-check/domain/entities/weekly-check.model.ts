import {
  WeeklyCheckDto,
  WeeklyCheckEntryDto,
} from '@haushaltsbuch/shared/sdks';
import { HistoryEntry } from '@haushaltsbuch/monthly-check/domain';

export type Week = WeeklyCheckDto;
export type WeeklyCheckEntry = WeeklyCheckEntryDto;

export type WeeklyCheckShops = Pick<
  WeeklyCheckDto,
  | 'away'
  | 'kaufland'
  | 'lidl'
  | 'edeka'
  | 'drugstore'
  | 'misc'
  | 'baker_butcher'
>;

export type WeeklyHistoryForm = Omit<HistoryEntry, 'date'>;
