export interface SalaryAdjustment {
  id: string;
  type: 'bonus' | 'deduction';
  amount: number;
  description: string;
  date: string;
  payPeriod?: string;
  processed?: boolean;
}

export type EmploymentType = 'Full Time' | 'Part Time' | 'Contractor' | 'Estagiário(a)';

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  position: string;
  salary: number;
  taxId: string;
  department: string;
  employmentType: EmploymentType;
  joinDate: string;
  terminationDate?: string;
  status: 'active' | 'archived';
  archiveReason?: string;
  workLocation?: string;
  bankName?: string;
  bankAccount?: string;
  address?: string;
  country?: string;
  foodAllowance?: number;
  communicationAllowance?: number;
  attendanceBonus?: number;
  assiduityBonus?: number;
  adjustments?: SalaryAdjustment[];
  processedAdjustments?: SalaryAdjustment[];
}

export interface NewEmployee extends Omit<Employee, 'id' | 'status' | 'adjustments' | 'processedAdjustments'> {
  employeeId: string;
  name: string;
  email: string;
  position: string;
  salary: number;
  taxId: string;
  department: string;
  employmentType: EmploymentType;
  joinDate: string;
}

export interface SalaryCalculation {
  baseSalary: number;
  totalAllowances: number;
  gross: number;
  incomeTax: number;
  socialSecurity: number;
  net: number;
  manualAdjustments: {
    bonuses: number;
    deductions: number;
  };
  totalDeductions: number;
}

export interface DepartmentAnalytics {
  name: string;
  employeeCount: number;
  totalSalary: number;
  averageSalary: number;
}