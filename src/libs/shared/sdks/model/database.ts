import { MergeDeep } from 'type-fest';
import { Database as DatabaseGenerated } from './database-generated';
import { WeeklyCheckDto } from './weeklyCheckDto';
import { HistoryEntryPayload } from '@haushaltsbuch/shared/sdks';

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        weekly_check: {
          Row: WeeklyCheckDto;
        };
      };
      Functions: {
        update_variable_costs_history_entry: {
          Args: {
            p_history_item: HistoryEntryPayload;
          };
        };
        update_budget_history_entry: {
          Args: {
            p_history_item: HistoryEntryPayload;
          };
        };
      };
    };
  }
>;
