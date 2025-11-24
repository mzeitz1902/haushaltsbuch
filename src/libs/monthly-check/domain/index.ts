import { MonthlyCheckFacade } from './application/monthly-check.facade';
import { MonthlyCheckDataService } from './infrastructure/monthly-check.data.service';
import { monthlyCheckStore } from './+state/monthly-check.store';

export * from './entities/monthly-check.model';
export * from './application/monthly-check.facade';

export function provideMonthlyCheckDomain() {
  return [MonthlyCheckDataService, monthlyCheckStore, MonthlyCheckFacade];
}
