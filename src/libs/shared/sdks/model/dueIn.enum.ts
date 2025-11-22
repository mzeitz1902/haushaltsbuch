import { Enums } from './database';

export type DueIn = Enums<'due_in'>;

export const DueInEnum = {
  All: 'Alle' as DueIn,
  Quarterly: 'Quartal' as DueIn,
};
