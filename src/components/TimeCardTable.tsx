import React from 'react';
import { TimeEntry } from '../types/timecard';
import { Employee } from '../types';

interface TimeCardTableProps {
  entries: TimeEntry[];
  employees: Employee[];
  period: string;
  selectedEmployee: Employee | null;
}

export function TimeCardTable({ entries, employees, period, selectedEmployee }: TimeCardTableProps) {
  const filteredEntries = selectedEmployee
    ? entries.filter(entry => entry.employeeId === selectedEmployee.id)
    : entries;

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      regular: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      dayoff: 'bg-gray-100 text-gray-800',
      holiday: 'bg-blue-100 text-blue-800',
      vacation: 'bg-purple-100 text-purple-800',
      sick: 'bg-yellow-100 text-yellow-800',
      incomplete: 'bg-orange-100 text-orange-800',
      remote: 'bg-indigo-100 text-indigo-800',
      justified: 'bg-teal-100 text-teal-800',
      halfday: 'bg-pink-100 text-pink-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEmployeeName = (employeeId: string): string => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };

  if (filteredEntries.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        Nenhum registro encontrado para o período selecionado.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          Registros de Ponto - {period}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              {!selectedEmployee && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcionário
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saída
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Horas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observação
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                {!selectedEmployee && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getEmployeeName(entry.employeeId)}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.clockIn || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.clockOut || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(entry.totalWork / 60).toFixed(2)}h
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                    {entry.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.note || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}