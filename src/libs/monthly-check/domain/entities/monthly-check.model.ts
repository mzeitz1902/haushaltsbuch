import { MonthDto } from '@haushaltsbuch/shared/sdks';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import { FixedCost } from '@haushaltsbuch/fixed-costs/domain';

export type Month = Omit<MonthDto, 'created_by' | 'created_at' | 'details'>;

export interface AddRevenueResponse {
  revenue: Revenue;
  total: number;
}

export interface AddFixedCostResponse {
  fixedCost: FixedCost;
  total: number;
}

export interface ChangeFixedCostResponse {
  fixedCosts: FixedCost[];
  total: number;
}

export interface ChangeRevenueResponse {
  revenue: Revenue[];
  total: number;
}

export interface CreatedMonth {
  month: string;
  translated: string;
}
