import { Enums } from './database-generated';

export type DueIn = Enums<'due_in'>;

export const DueInEnum = {
  All: 'Alle' as DueIn,
  Quarterly: 'Quartal' as DueIn,
};
