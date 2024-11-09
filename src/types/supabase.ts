export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          name: string
          email: string
          position: string
          salary: number
          tax_id: string
          department: string
          employment_type: string
          join_date: string
          termination_date: string | null
          status: string
          archive_reason: string | null
          work_location: string | null
          bank_name: string | null
          bank_account: string | null
          address: string | null
          country: string | null
          food_allowance: number | null
          communication_allowance: number | null
          attendance_bonus: number | null
          assiduity_bonus: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          name: string
          email: string
          position: string
          salary: number
          tax_id: string
          department: string
          employment_type: string
          join_date: string
          termination_date?: string | null
          status?: string
          archive_reason?: string | null
          work_location?: string | null
          bank_name?: string | null
          bank_account?: string | null
          address?: string | null
          country?: string | null
          food_allowance?: number | null
          communication_allowance?: number | null
          attendance_bonus?: number | null
          assiduity_bonus?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          employee_id?: string
          name?: string
          email?: string
          position?: string
          salary?: number
          tax_id?: string
          department?: string
          employment_type?: string
          join_date?: string
          termination_date?: string | null
          status?: string
          archive_reason?: string | null
          work_location?: string | null
          bank_name?: string | null
          bank_account?: string | null
          address?: string | null
          country?: string | null
          food_allowance?: number | null
          communication_allowance?: number | null
          attendance_bonus?: number | null
          assiduity_bonus?: number | null
        }
      }
      salary_adjustments: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          type: string
          amount: number
          description: string
          date: string
          pay_period: string | null
          processed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          type: string
          amount: number
          description: string
          date: string
          pay_period?: string | null
          processed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          employee_id?: string
          type?: string
          amount?: number
          description?: string
          date?: string
          pay_period?: string | null
          processed?: boolean
        }
      }
      time_entries: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          date: string
          status: string
          clock_in: string | null
          clock_in_description: string | null
          clock_out: string | null
          clock_out_description: string | null
          total_work: number
          total_break: number
          total_overtime: number
          edited: boolean
          edited_by: string | null
          note: string | null
          justification: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          date: string
          status: string
          clock_in?: string | null
          clock_in_description?: string | null
          clock_out?: string | null
          clock_out_description?: string | null
          total_work: number
          total_break: number
          total_overtime: number
          edited?: boolean
          edited_by?: string | null
          note?: string | null
          justification?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          employee_id?: string
          date?: string
          status?: string
          clock_in?: string | null
          clock_in_description?: string | null
          clock_out?: string | null
          clock_out_description?: string | null
          total_work?: number
          total_break?: number
          total_overtime?: number
          edited?: boolean
          edited_by?: string | null
          note?: string | null
          justification?: string | null
        }
      }
      payroll_history: {
        Row: {
          id: string
          created_at: string
          month: string
          processed_date: string
          status: string
          total_gross: number
          total_deductions: number
          total_net: number
          processed_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          month: string
          processed_date: string
          status: string
          total_gross: number
          total_deductions: number
          total_net: number
          processed_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          month?: string
          processed_date?: string
          status?: string
          total_gross?: number
          total_deductions?: number
          total_net?: number
          processed_by?: string | null
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}