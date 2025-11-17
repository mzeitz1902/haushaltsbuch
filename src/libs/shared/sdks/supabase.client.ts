import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Database } from './model/database';

export const supabase = createClient<Database>(
  environment.supabaseUrl,
  environment.supabaseKey
);
