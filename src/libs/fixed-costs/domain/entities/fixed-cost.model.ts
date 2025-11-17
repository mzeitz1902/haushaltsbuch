import { FixedCostDto } from '@haushaltsbuch/shared/sdks';

export type FixedCost = Omit<FixedCostDto, 'created_at'>;
export type AddFixedCostPayload = Pick<FixedCostDto, 'category' | 'value'>;
export type UpdateFixedCostPayload = FixedCost;
