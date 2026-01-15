export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      fixed_costs: {
        Row: {
          category: string | null;
          due_date: Database['public']['Enums']['due_date'] | null;
          due_in: Database['public']['Enums']['due_in'] | null;
          due_in_month: string[] | null;
          id: number;
          remark: string | null;
          type: Database['public']['Enums']['fixed_cost_type'];
          value: number | null;
        };
        Insert: {
          category?: string | null;
          due_date?: Database['public']['Enums']['due_date'] | null;
          due_in?: Database['public']['Enums']['due_in'] | null;
          due_in_month?: string[] | null;
          id?: number;
          remark?: string | null;
          type?: Database['public']['Enums']['fixed_cost_type'];
          value?: number | null;
        };
        Update: {
          category?: string | null;
          due_date?: Database['public']['Enums']['due_date'] | null;
          due_in?: Database['public']['Enums']['due_in'] | null;
          due_in_month?: string[] | null;
          id?: number;
          remark?: string | null;
          type?: Database['public']['Enums']['fixed_cost_type'];
          value?: number | null;
        };
        Relationships: [];
      };
      monthly_snapshots: {
        Row: {
          budget_lines: Json | null;
          created_at: string | null;
          created_by: string | null;
          details: Json | null;
          fixed_costs_lines: Json | null;
          fixed_costs_total: number | null;
          id: string;
          month: string;
          revenue_lines: Json | null;
          revenue_total: number | null;
          updated_at: string | null;
          variable_costs_lines: Json | null;
          variable_costs_total: number | null;
        };
        Insert: {
          budget_lines?: Json | null;
          created_at?: string | null;
          created_by?: string | null;
          details?: Json | null;
          fixed_costs_lines?: Json | null;
          fixed_costs_total?: number | null;
          id?: string;
          month: string;
          revenue_lines?: Json | null;
          revenue_total?: number | null;
          updated_at?: string | null;
          variable_costs_lines?: Json | null;
          variable_costs_total?: number | null;
        };
        Update: {
          budget_lines?: Json | null;
          created_at?: string | null;
          created_by?: string | null;
          details?: Json | null;
          fixed_costs_lines?: Json | null;
          fixed_costs_total?: number | null;
          id?: string;
          month?: string;
          revenue_lines?: Json | null;
          revenue_total?: number | null;
          updated_at?: string | null;
          variable_costs_lines?: Json | null;
          variable_costs_total?: number | null;
        };
        Relationships: [];
      };
      revenue: {
        Row: {
          category: string | null;
          id: number;
          value: number | null;
        };
        Insert: {
          category?: string | null;
          id?: number;
          value?: number | null;
        };
        Update: {
          category?: string | null;
          id?: number;
          value?: number | null;
        };
        Relationships: [];
      };
      weekly_check: {
        Row: {
          away: Json;
          baker_butcher: Json;
          cw: number;
          dateFrom: string;
          dateTo: string;
          drugstore: Json;
          edeka: Json;
          id: number;
          kaufland: Json;
          lidl: Json;
          misc: Json;
          month: Database['public']['Enums']['month'];
          total: number;
        };
        Insert: {
          away: Json;
          baker_butcher: Json;
          cw: number;
          dateFrom: string;
          dateTo: string;
          drugstore: Json;
          edeka: Json;
          id?: number;
          kaufland: Json;
          lidl: Json;
          misc: Json;
          month: Database['public']['Enums']['month'];
          total: number;
        };
        Update: {
          away?: Json;
          baker_butcher?: Json;
          cw?: number;
          dateFrom?: string;
          dateTo?: string;
          drugstore?: Json;
          edeka?: Json;
          id?: number;
          kaufland?: Json;
          lidl?: Json;
          misc?: Json;
          month?: Database['public']['Enums']['month'];
          total?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      add_budget_history_entry: {
        Args: { p_line_id: string; p_snapshot_id: string };
        Returns: undefined;
      };
      add_monthly_snapshot_budget_line: {
        Args: { p_line: Json; p_snapshot_id: string };
        Returns: undefined;
      };
      add_monthly_snapshot_fixed_costs_line: {
        Args: { p_added_by?: string; p_line: Json; p_snapshot_id: string };
        Returns: {
          retval_fixed_costs: Json;
          retval_fixed_costs_total: number;
          retval_id: string;
          retval_line: Json;
          retval_updated_at: string;
        }[];
      };
      add_monthly_snapshot_revenue_line: {
        Args: { p_added_by?: string; p_line: Json; p_snapshot_id: string };
        Returns: {
          retval_id: string;
          retval_line: Json;
          retval_revenue_lines: Json;
          retval_revenue_total: number;
          retval_updated_at: string;
        }[];
      };
      add_monthly_snapshot_variable_costs_line: {
        Args: { p_added_by?: string; p_line: Json; p_snapshot_id: string };
        Returns: {
          retval_id: string;
          retval_line: Json;
          retval_updated_at: string;
          retval_variable_costs: Json;
          retval_variable_costs_total: number;
        }[];
      };
      add_variable_costs_history_entry: {
        Args: {
          p_created_by?: string;
          p_line_id: string;
          p_snapshot_id: string;
        };
        Returns: {
          variable_costs_lines: Json;
          variable_costs_total: number;
        }[];
      };
      create_monthly_snapshot: {
        Args: { p_created_by?: string; p_month: string };
        Returns: {
          fixed_costs_rows_count: number;
          id: string;
          revenue_rows_count: number;
        }[];
      };
      delete_monthly_snapshot_budget_history_entry: {
        Args: {
          p_history_item_id: string;
          p_line_id: string;
          p_snapshot_id: string;
        };
        Returns: {
          out_variable_costs_lines: Json;
          out_variable_costs_total: number;
        }[];
      };
      delete_monthly_snapshot_budget_line: {
        Args: { p_line_id: string; p_snapshot_id: string };
        Returns: undefined;
      };
      delete_monthly_snapshot_fixed_costs_line: {
        Args: {
          p_deleted_by?: string;
          p_line_id: string;
          p_snapshot_id: string;
        };
        Returns: {
          retval_fixed_costs: Json;
          retval_fixed_costs_total: number;
          retval_id: string;
          retval_removed_line: Json;
          retval_updated_at: string;
        }[];
      };
      delete_monthly_snapshot_revenue_line: {
        Args: {
          p_deleted_by?: string;
          p_line_id: string;
          p_snapshot_id: string;
        };
        Returns: {
          retval_id: string;
          retval_removed_line: Json;
          retval_revenue_lines: Json;
          retval_revenue_total: number;
          retval_updated_at: string;
        }[];
      };
      delete_monthly_snapshot_variable_costs_history_entry: {
        Args: {
          p_history_item_id: string;
          p_line_id: string;
          p_snapshot_id: string;
        };
        Returns: {
          out_variable_costs_lines: Json;
          out_variable_costs_total: number;
        }[];
      };
      delete_monthly_snapshot_variable_costs_line: {
        Args: {
          p_deleted_by?: string;
          p_line_id: string;
          p_snapshot_id: string;
        };
        Returns: {
          retval_id: string;
          retval_removed_line: Json;
          retval_updated_at: string;
          retval_variable_costs: Json;
          retval_variable_costs_total: number;
        }[];
      };
      delete_variable_cost_line_from_snapshot: {
        Args: {
          line_index: number;
          performed_by?: string;
          snapshot_month: string;
        };
        Returns: {
          id: string;
          month: string;
          updated_at: string;
          variable_costs_lines: Json;
          variable_costs_total: number;
        }[];
      };
      update_budget_history_entry: {
        Args: {
          p_history_item: Json;
          p_line_id: string;
          p_snapshot_id: string;
        };
        Returns: Database['public']['CompositeTypes']['update_budget_history_result'];
        SetofOptions: {
          from: '*';
          to: 'update_budget_history_result';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      update_monthly_snapshot_budget_line: {
        Args: { p_line_id: string; p_new_values: Json; p_snapshot_id: string };
        Returns: {
          out_id: string;
          out_updated_at: string;
          out_variable_costs_lines: Json;
          out_variable_costs_total: number;
        }[];
      };
      update_monthly_snapshot_fixed_costs_line: {
        Args: {
          p_line_id: string;
          p_new_values: Json;
          p_snapshot_id: string;
          p_updated_by?: string;
        };
        Returns: {
          retval_fixed_costs: Json;
          retval_fixed_costs_total: number;
          retval_id: string;
          retval_line: Json;
          retval_updated_at: string;
        }[];
      };
      update_monthly_snapshot_revenue_line: {
        Args: {
          p_line_id: string;
          p_new_values: Json;
          p_snapshot_id: string;
          p_updated_by?: string;
        };
        Returns: {
          retval_id: string;
          retval_line: Json;
          retval_revenue_lines: Json;
          retval_revenue_total: number;
          retval_updated_at: string;
        }[];
      };
      update_monthly_snapshot_variable_costs_line: {
        Args: {
          p_line_id: string;
          p_new_values: Json;
          p_snapshot_id: string;
          p_updated_by?: string;
        };
        Returns: {
          out_id: string;
          out_updated_at: string;
          out_variable_costs_lines: Json;
          out_variable_costs_total: number;
        }[];
      };
      update_variable_costs_history_entry: {
        Args: {
          p_history_item: Json;
          p_line_id: string;
          p_snapshot_id: string;
          p_updated_by?: string;
        };
        Returns: {
          snapshot_id: string;
          updated_at: string;
          updated_line: Json;
          variable_costs_lines: Json;
          variable_costs_total: number;
        }[];
      };
    };
    Enums: {
      due_date: '15' | '1';
      due_in: 'Alle' | 'Quartal' | 'Sonder';
      fixed_cost_type: 'Fix' | 'Budget';
      month:
        | 'Januar'
        | 'Februar'
        | 'März'
        | 'April'
        | 'Mai'
        | 'Juni'
        | 'Juli'
        | 'August'
        | 'September'
        | 'Oktober'
        | 'November'
        | 'Dezember';
    };
    CompositeTypes: {
      update_budget_history_result: {
        snapshot_id: string | null;
        updated_line: Json | null;
        budget_lines: Json | null;
        updated_at: string | null;
      };
    };
  };
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      due_date: ['15', '1'],
      due_in: ['Alle', 'Quartal', 'Sonder'],
      fixed_cost_type: ['Fix', 'Budget'],
      month: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ],
    },
  },
} as const;
