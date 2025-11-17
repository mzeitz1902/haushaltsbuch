import { RevenueDto } from '@haushaltsbuch/shared/sdks';

export type Revenue = Omit<RevenueDto, 'created_at'>;
export type AddRevenuePayload = Pick<RevenueDto, 'category' | 'value'>;
export type UpdateRevenuePayload = Revenue;
