export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          employee_id: string;
          name: string;
          email: string;
          position: string;
          salary: number;
          tax_id: string;
          department: string;
          employment_type: 'Full Time' | 'Part Time' | 'Contractor' | 'Estagiário(a)';
          join_date: string;
          termination_date?: string;
          status: 'active' | 'archived';
          archive_reason?: string;
          work_location?: string;
          bank_name?: string;
          bank_account?: string;
          address?: string;
          country?: string;
          food_allowance?: number;
          communication_allowance?: number;
          attendance_bonus?: number;
          assiduity_bonus?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['employees']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['employees']['Insert']>;
      };
    };
  };
}