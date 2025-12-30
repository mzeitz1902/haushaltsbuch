import { MonthDto } from '@haushaltsbuch/shared/sdks';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import { FixedCost } from '@haushaltsbuch/fixed-costs/domain';

export type Month = Omit<
  MonthDto,
  | 'created_by'
  | 'created_at'
  | 'details'
  | 'variable_costs_lines'
  | 'budget_lines'
> & { variable_costs_lines: VariableCost[]; budget_lines: VariableCost[] };

export interface AddRevenueResponse {
  revenue: Revenue;
  total: number;
}

export interface AddFixedCostResponse {
  fixedCost: FixedCost;
  total: number;
}

export interface AddVariableCostResponse {
  variableCost: VariableCost;
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

export interface ChangeVariableCostResponse {
  variableCosts: VariableCost[];
  total: number;
}

export interface CreatedMonth {
  month: string;
  translated: string;
}

export interface HistoryEntry {
  id: string;
  value: number;
  date: Date;
  note: string;
}

export interface VariableCost {
  id: string;
  category: string | null;
  forecast: number | null;
  value: number | null;
  history: HistoryEntry[];
}
