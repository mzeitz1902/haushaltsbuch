import { WeeklyCheckDataService } from './infrastructure/weekly-check.data.service';
import { WeeklyCheckStore } from './+state/weekly-check.store';
import { WeeklyCheckFacade } from './application/weekly-check.facade';

export * from './application/weekly-check.facade';
export * from './entities/weekly-check.model';

export function provideWeeklyCheckDomain() {
  return [WeeklyCheckDataService, WeeklyCheckFacade, WeeklyCheckStore];
}
