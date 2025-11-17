import { FixedCostsFacade } from './application/fixed-costs.facade';
import { FixedCostsDataService } from './infrastructure/fixed-costs.data.service';
import { FixedCostsStore } from './+state/fixed-costs.store';

export * from './application/fixed-costs.facade';
export * from './entities/fixed-cost.model';

export function provideFixedCostsDomain() {
  return [FixedCostsDataService, FixedCostsFacade, FixedCostsStore];
}
