import { EmploymentType, NewEmployee } from '../types';

export const departments = [
  'Engineering',
  'Finance',
  'Human Resources',
  'Marketing',
  'Operations',
  'Sales',
] as const;

export const positions = {
  Engineering: ['Software Engineer', 'Senior Developer', 'Tech Lead', 'DevOps Engineer'],
  Finance: ['Accountant', 'Financial Analyst', 'Finance Manager', 'Controller'],
  'Human Resources': ['HR Specialist', 'HR Manager', 'Recruiter', 'Training Coordinator'],
  Marketing: ['Marketing Specialist', 'Digital Marketer', 'Marketing Manager', 'Content Creator'],
  Operations: ['Operations Manager', 'Project Manager', 'Business Analyst', 'Quality Assurance'],
  Sales: ['Sales Representative', 'Account Manager', 'Sales Manager', 'Business Developer'],
} as const;

export const employmentTypes: EmploymentType[] = [
  'Full Time',
  'Part Time',
  'Contractor',
  'Estagiário(a)',
];

export const sampleEmployees: NewEmployee[] = [
  {
    employeeId: 'EMP001',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    position: 'Software Engineer',
    salary: 85000,
    taxId: 'CV123456789',
    department: 'Engineering',
    joinDate: '2023-01-15',
    employmentType: 'Full Time',
    workLocation: 'Praia',
    foodAllowance: 6500,
    communicationAllowance: 3500,
    attendanceBonus: 5000,
    assiduityBonus: 5000,
    bankName: 'BCA',
    bankAccount: '12345678',
    address: 'Rua Principal, 123',
    country: 'Cape Verde',
  },
];