import { HistoryEntryDto } from './historyEntryDto';

export interface WeeklyCheckEntryDto {
  id: string;
  value: number;
  history: HistoryEntryDto[];
}
