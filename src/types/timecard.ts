export type TimeEntryStatus = 
  | 'regular'      // Normal working day with punch-in/out
  | 'absent'       // No show without justification
  | 'dayoff'       // Scheduled day off
  | 'holiday'      // Public holiday
  | 'vacation'     // Scheduled vacation
  | 'sick'         // Sick leave
  | 'incomplete'   // Missing punch-in or punch-out
  | 'remote'       // Working remotely
  | 'justified'    // Absence with justification
  | 'halfday';     // Half day (morning or afternoon)

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  status: TimeEntryStatus;
  clockIn?: string;
  clockInDescription?: string;
  clockOut?: string;
  clockOutDescription?: string;
  totalWork: number; // in minutes
  totalBreak: number; // in minutes
  totalOvertime: number; // in minutes
  edited: boolean;
  editedBy?: string;
  note?: string;
  justification?: string;
}

export interface TimeCardTemplate {
  employeeId: string;
  employeeName: string;
  date: string;
  status: TimeEntryStatus;
  clockIn?: string;
  clockInDescription?: string;
  clockOut?: string;
  clockOutDescription?: string;
  totalWork: string;
  totalBreak: string;
  totalOvertime: string;
  edited: string;
  editedBy: string;
  note: string;
  justification?: string;
}