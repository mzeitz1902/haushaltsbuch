import {
  WeeklyCheckDto,
  WeeklyCheckEntryDto,
} from '@haushaltsbuch/shared/sdks';

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
