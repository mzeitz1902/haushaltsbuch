import { MonthDto } from '@haushaltsbuch/shared/sdks';

export type Month = Omit<MonthDto, 'created_by' | 'created_at'>;
