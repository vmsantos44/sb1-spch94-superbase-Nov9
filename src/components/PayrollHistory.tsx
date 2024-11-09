import React, { useState } from 'react';
import { useEmployeeStore } from '../stores/employeeStore';
import { formatCurrency } from '../utils/calculations';
import { Download, X } from 'lucide-react';
import Papa from 'papaparse';

interface PayrollHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PayrollHistory({ isOpen, onClose }: PayrollHistoryProps) {
  const { payrollHistory } = useEmployeeStore();
  const [selectedMonth, setSelectedMonth] = useState('');

  const selectedPayroll = payrollHistory.find(p => p.month === selectedMonth);

  const exportPayroll = () => {
    if (!selectedPayroll) return;

    const payrollData = selectedPayroll.employees.map(employee => ({
      'Nome do Funcionário': employee.name,
      'Salário Base': formatCurrency(employee.baseSalary),
      'Subsídios': formatCurrency(employee.allowances),
      'Descontos': formatCurrency(employee.deductions),
      'Salário Líquido': formatCurrency(employee.netSalary),
      'Data de Processamento': new Date(selectedPayroll.processedDate).toLocaleDateString(),
    }));

    const csv = Papa.unparse(payrollData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `folha-${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // Remove duplicates and sort by month
  const uniquePayrollRecords = Array.from(
    new Map(payrollHistory.map(record => [record.month, record])).values()
  ).sort((a, b) => b.month.localeCompare(a.month));

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Histórico de Folhas</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecionar Período</option>
            {uniquePayrollRecords.map(record => (
              <option key={record.id} value={record.month}>
                {new Date(record.month + '-01').toLocaleDateString('pt-BR', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </option>
            ))}
          </select>
        </div>

        {selectedPayroll && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Processado em: {new Date(selectedPayroll.processedDate).toLocaleString()}
              </div>
              <button
                onClick={exportPayroll}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funcionário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salário Base
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subsídios
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descontos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salário Líquido
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedPayroll.employees.map((employee) => (
                    <tr key={employee.employeeId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(employee.baseSalary)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(employee.allowances)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600">
                          {formatCurrency(employee.deductions)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(employee.netSalary)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}