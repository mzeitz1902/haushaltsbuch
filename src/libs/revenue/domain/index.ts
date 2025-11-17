import { RevenueFacade } from './application/revenue.facade';
import { RevenueDataService } from './infrastructure/revenue.data.service';
import { RevenueStore } from './+state/revenue.store';

export * from './application/revenue.facade';

export * from './entities/revenue.model';

export function provideRevenueDomain() {
  return [RevenueDataService, RevenueFacade, RevenueStore];
}
