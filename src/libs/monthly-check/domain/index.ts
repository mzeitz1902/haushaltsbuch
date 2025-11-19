import { MonthlyCheckFacade } from './application/monthly-check.facade';
import { MonthlyCheckDataService } from './infrastructure/monthly-check.data.service';

export function provideMonthlyCheckDomain() {
  return [MonthlyCheckDataService, MonthlyCheckFacade];
}
