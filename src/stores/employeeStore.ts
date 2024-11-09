import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Employee, NewEmployee } from '../types';
import { sampleEmployees } from '../data/sampleData';
import { calculateSalary } from '../utils/calculations';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface EmployeeStore {
  employees: Employee[];
  payrollHistory: any[];
  initialized: boolean;
  isLoading: boolean;
  error: string | null;
  addEmployee: (employee: NewEmployee) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  archiveEmployee: (id: string, reason: string) => Promise<void>;
  getActiveEmployees: () => Employee[];
  getArchivedEmployees: () => Employee[];
  processPayroll: (month: string) => Promise<void>;
  getPayrollByMonth: (month: string) => any;
  fetchEmployees: () => Promise<void>;
  migrateLocalDataToSupabase: () => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: [],
      payrollHistory: [],
      initialized: false,
      isLoading: false,
      error: null,

      fetchEmployees: async () => {
        set({ isLoading: true, error: null });
        
        try {
          if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured, using local storage');
            if (!get().initialized) {
              set({ 
                employees: sampleEmployees.map(emp => ({
                  ...emp,
                  id: Math.random().toString(36).substr(2, 9),
                  status: 'active',
                  adjustments: [],
                  processedAdjustments: []
                })),
                initialized: true
              });
            }
            set({ isLoading: false });
            return;
          }

          const { data, error } = await supabase
            .from('employees')
            .select('*')
            .order('name');

          if (error) throw error;

          const formattedEmployees = data.map(emp => ({
            id: emp.id,
            employeeId: emp.employee_id,
            name: emp.name,
            email: emp.email,
            position: emp.position,
            salary: emp.salary,
            taxId: emp.tax_id,
            department: emp.department,
            employmentType: emp.employment_type,
            joinDate: emp.join_date,
            terminationDate: emp.termination_date,
            status: emp.status,
            archiveReason: emp.archive_reason,
            workLocation: emp.work_location,
            bankName: emp.bank_name,
            bankAccount: emp.bank_account,
            address: emp.address,
            country: emp.country,
            foodAllowance: emp.food_allowance,
            communicationAllowance: emp.communication_allowance,
            attendanceBonus: emp.attendance_bonus,
            assiduityBonus: emp.assiduity_bonus,
            adjustments: [],
            processedAdjustments: []
          }));

          set({ employees: formattedEmployees, initialized: true, isLoading: false });
        } catch (error) {
          console.error('Error fetching employees:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch employees',
            isLoading: false 
          });
        }
      },

      addEmployee: async (employee: NewEmployee) => {
        set({ isLoading: true, error: null });
        
        try {
          if (!isSupabaseConfigured()) {
            const newEmployee = {
              ...employee,
              id: Math.random().toString(36).substr(2, 9),
              status: 'active' as const,
              adjustments: [],
              processedAdjustments: []
            };
            set(state => ({ 
              employees: [...state.employees, newEmployee],
              isLoading: false 
            }));
            return;
          }

          const { data, error } = await supabase
            .from('employees')
            .insert([{
              employee_id: employee.employeeId,
              name: employee.name,
              email: employee.email,
              position: employee.position,
              salary: employee.salary,
              tax_id: employee.taxId,
              department: employee.department,
              employment_type: employee.employmentType,
              join_date: employee.joinDate,
              work_location: employee.workLocation,
              bank_name: employee.bankName,
              bank_account: employee.bankAccount,
              address: employee.address,
              country: employee.country,
              food_allowance: employee.foodAllowance,
              communication_allowance: employee.communicationAllowance,
              attendance_bonus: employee.attendanceBonus,
              assiduity_bonus: employee.assiduityBonus
            }])
            .select()
            .single();

          if (error) throw error;

          const newEmployee: Employee = {
            id: data.id,
            employeeId: data.employee_id,
            name: data.name,
            email: data.email,
            position: data.position,
            salary: data.salary,
            taxId: data.tax_id,
            department: data.department,
            employmentType: data.employment_type,
            joinDate: data.join_date,
            status: 'active',
            workLocation: data.work_location,
            bankName: data.bank_name,
            bankAccount: data.bank_account,
            address: data.address,
            country: data.country,
            foodAllowance: data.food_allowance,
            communicationAllowance: data.communication_allowance,
            attendanceBonus: data.attendance_bonus,
            assiduityBonus: data.assiduity_bonus,
            adjustments: [],
            processedAdjustments: []
          };

          set(state => ({ 
            employees: [...state.employees, newEmployee],
            isLoading: false 
          }));
        } catch (error) {
          console.error('Error adding employee:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add employee',
            isLoading: false 
          });
        }
      },

      updateEmployee: async (id: string, updates: Partial<Employee>) => {
        set({ isLoading: true, error: null });
        
        try {
          if (!isSupabaseConfigured()) {
            set(state => ({
              employees: state.employees.map(emp =>
                emp.id === id ? { ...emp, ...updates } : emp
              ),
              isLoading: false
            }));
            return;
          }

          const { error } = await supabase
            .from('employees')
            .update({
              employee_id: updates.employeeId,
              name: updates.name,
              email: updates.email,
              position: updates.position,
              salary: updates.salary,
              tax_id: updates.taxId,
              department: updates.department,
              employment_type: updates.employmentType,
              join_date: updates.joinDate,
              work_location: updates.workLocation,
              bank_name: updates.bankName,
              bank_account: updates.bankAccount,
              address: updates.address,
              country: updates.country,
              food_allowance: updates.foodAllowance,
              communication_allowance: updates.communicationAllowance,
              attendance_bonus: updates.attendanceBonus,
              assiduity_bonus: updates.assiduityBonus
            })
            .eq('id', id);

          if (error) throw error;

          set(state => ({
            employees: state.employees.map(emp =>
              emp.id === id ? { ...emp, ...updates } : emp
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error updating employee:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update employee',
            isLoading: false 
          });
        }
      },

      archiveEmployee: async (id: string, reason: string) => {
        set({ isLoading: true, error: null });
        
        try {
          if (!isSupabaseConfigured()) {
            set(state => ({
              employees: state.employees.map(emp =>
                emp.id === id ? {
                  ...emp,
                  status: 'archived',
                  archiveReason: reason,
                  terminationDate: new Date().toISOString().split('T')[0]
                } : emp
              ),
              isLoading: false
            }));
            return;
          }

          const { error } = await supabase
            .from('employees')
            .update({
              status: 'archived',
              archive_reason: reason,
              termination_date: new Date().toISOString().split('T')[0]
            })
            .eq('id', id);

          if (error) throw error;

          set(state => ({
            employees: state.employees.map(emp =>
              emp.id === id ? {
                ...emp,
                status: 'archived',
                archiveReason: reason,
                terminationDate: new Date().toISOString().split('T')[0]
              } : emp
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error archiving employee:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to archive employee',
            isLoading: false 
          });
        }
      },

      getActiveEmployees: () => {
        return get().employees.filter(emp => emp.status === 'active');
      },

      getArchivedEmployees: () => {
        return get().employees.filter(emp => emp.status === 'archived');
      },

      processPayroll: async (month: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const activeEmployees = get().getActiveEmployees();
          const payrollRecord = {
            id: Math.random().toString(36).substr(2, 9),
            month,
            processedDate: new Date().toISOString(),
            status: 'processed',
            employees: activeEmployees.map(employee => {
              const salary = calculateSalary(employee, employee.adjustments || []);
              return {
                employeeId: employee.id,
                name: employee.name,
                baseSalary: salary.baseSalary,
                allowances: salary.totalAllowances,
                deductions: salary.totalDeductions,
                netSalary: salary.net,
                adjustments: employee.adjustments || []
              };
            })
          };

          if (isSupabaseConfigured()) {
            const { error } = await supabase
              .from('payroll_history')
              .insert([{
                month,
                processed_date: new Date().toISOString(),
                status: 'processed',
                total_gross: payrollRecord.employees.reduce((sum, emp) => sum + emp.baseSalary + emp.allowances, 0),
                total_deductions: payrollRecord.employees.reduce((sum, emp) => sum + emp.deductions, 0),
                total_net: payrollRecord.employees.reduce((sum, emp) => sum + emp.netSalary, 0)
              }]);

            if (error) throw error;
          }

          set(state => ({
            payrollHistory: [...state.payrollHistory, payrollRecord],
            employees: state.employees.map(emp => ({
              ...emp,
              processedAdjustments: [
                ...(emp.processedAdjustments || []),
                ...(emp.adjustments || []).map(adj => ({
                  ...adj,
                  processed: true,
                  payPeriod: month
                }))
              ],
              adjustments: []
            })),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error processing payroll:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to process payroll',
            isLoading: false 
          });
        }
      },

      getPayrollByMonth: (month: string) => {
        return get().payrollHistory.find(p => p.month === month);
      },

      migrateLocalDataToSupabase: async () => {
        if (!isSupabaseConfigured()) return;

        const state = get();
        if (state.employees.length === 0) return;

        set({ isLoading: true, error: null });

        try {
          // Check if data already exists in Supabase
          const { data: existingData } = await supabase
            .from('employees')
            .select('employee_id');

          if (existingData && existingData.length > 0) {
            console.log('Data already exists in Supabase, skipping migration');
            return;
          }

          // Migrate each employee
          for (const employee of state.employees) {
            const { error } = await supabase
              .from('employees')
              .insert([{
                id: employee.id,
                employee_id: employee.employeeId,
                name: employee.name,
                email: employee.email,
                position: employee.position,
                salary: employee.salary,
                tax_id: employee.taxId,
                department: employee.department,
                employment_type: employee.employmentType,
                join_date: employee.joinDate,
                termination_date: employee.terminationDate,
                status: employee.status,
                archive_reason: employee.archiveReason,
                work_location: employee.workLocation,
                bank_name: employee.bankName,
                bank_account: employee.bankAccount,
                address: employee.address,
                country: employee.country,
                food_allowance: employee.foodAllowance,
                communication_allowance: employee.communicationAllowance,
                attendance_bonus: employee.attendanceBonus,
                assiduity_bonus: employee.assiduityBonus
              }]);

            if (error) throw error;
          }

          console.log('Successfully migrated local data to Supabase');
        } catch (error) {
          console.error('Error migrating data:', error);
          set({ error: 'Failed to migrate data to Supabase' });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'employee-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);