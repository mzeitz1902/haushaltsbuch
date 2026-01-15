import { FixedCostDto } from '@haushaltsbuch/shared/sdks';
import { Enums } from '../../../shared/sdks/model/database-generated';

export type FixedCost = Omit<FixedCostDto, 'created_at'>;
export type AddFixedCostPayload = Pick<
  FixedCostDto,
  'category' | 'value' | 'due_in' | 'type'
>;
export type UpdateFixedCostPayload = FixedCost;
export type FixedCostType = Enums<'fixed_cost_type'>;
