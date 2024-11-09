import React, { useState } from 'react';
import { Employee } from '../types';
import { departments } from '../data/sampleData';
import { SalaryBreakdown } from './SalaryBreakdown';
import { SalaryAdjustments } from './SalaryAdjustments';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface EmployeeFormProps {
  employee: Employee;
  onSubmit: (employee: Employee) => Promise<void>;
  onCancel: () => void;
}

export function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Employee>({
    ...employee,
    employeeId: employee.employeeId || '',
    name: employee.name || '',
    email: employee.email || '',
    position: employee.position || '',
    salary: employee.salary || 0,
    taxId: employee.taxId || '',
    department: employee.department || '',
    employmentType: employee.employmentType || 'Full Time',
    joinDate: employee.joinDate || '',
    workLocation: employee.workLocation || '',
    bankName: employee.bankName || '',
    bankAccount: employee.bankAccount || '',
    address: employee.address || '',
    country: employee.country || '',
    foodAllowance: employee.foodAllowance || 6500,
    communicationAllowance: employee.communicationAllowance || 3500,
    attendanceBonus: employee.attendanceBonus || 5000,
    assiduityBonus: employee.assiduityBonus || 5000,
    adjustments: employee.adjustments || []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await onSubmit(formData);
      setSuccess(employee.id ? 'Funcionário atualizado com sucesso!' : 'Funcionário adicionado com sucesso!');
      setTimeout(() => onCancel(), 1500); // Close form after showing success message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar funcionário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the form remains the same */}
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting 
            ? 'Salvando...' 
            : employee.id 
              ? 'Atualizar' 
              : 'Adicionar'
          }
        </button>
      </div>
    </form>
  );
}