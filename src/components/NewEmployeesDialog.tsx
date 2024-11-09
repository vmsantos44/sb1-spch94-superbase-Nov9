import React, { useState } from 'react';
import { departments } from '../data/sampleData';

interface NewEmployeesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (employees: any[]) => void;
  employees: any[];
}

export function NewEmployeesDialog({
  isOpen,
  onClose,
  onConfirm,
  employees,
}: NewEmployeesDialogProps) {
  const [employeeData, setEmployeeData] = useState(
    employees.map(emp => ({
      ...emp,
      department: '',
      position: '',
      taxId: '',
      email: '',
    }))
  );

  if (!isOpen) return null;

  const handleInputChange = (index: number, field: string, value: string) => {
    const newData = [...employeeData];
    newData[index] = { ...newData[index], [field]: value };
    setEmployeeData(newData);
  };

  const isFormValid = () => {
    return employeeData.every(emp => 
      emp.department && emp.position && emp.taxId && emp.email
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Funcionários não encontrados no sistema:
        </h3>
        
        <div className="space-y-6">
          {employeeData.map((emp, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-lg mb-4">{emp['Nome']}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Departamento*
                  </label>
                  <select
                    value={emp.department}
                    onChange={(e) => handleInputChange(index, 'department', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecionar Departamento</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cargo*
                  </label>
                  <input
                    type="text"
                    value={emp.position}
                    onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    NIF*
                  </label>
                  <input
                    type="text"
                    value={emp.taxId}
                    onChange={(e) => handleInputChange(index, 'taxId', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email*
                  </label>
                  <input
                    type="email"
                    value={emp.email}
                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(employeeData)}
              disabled={!isFormValid()}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                isFormValid()
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Adicionar Funcionários
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}