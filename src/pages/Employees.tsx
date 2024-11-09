import React, { useState } from 'react';
import { useEmployeeStore } from '../stores/employeeStore';
import { PlusCircle, Pencil, Archive, FileUp, FileDown, Users } from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Employee } from '../types';
import { EmployeeForm } from '../components/EmployeeForm';
import { formatCurrency } from '../utils/calculations';
import * as XLSX from 'xlsx';

const EMPTY_EMPLOYEE: Employee = {
  id: '',
  employeeId: '',
  name: '',
  email: '',
  position: '',
  salary: 0,
  taxId: '',
  department: '',
  employmentType: 'Full Time',
  joinDate: '',
  status: 'active'
};

export function Employees() {
  const { employees, addEmployee, updateEmployee, archiveEmployee, error } = useEmployeeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [employeeToArchive, setEmployeeToArchive] = useState<Employee | null>(null);
  const [archiveReason, setArchiveReason] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const downloadTemplate = () => {
    const EMPLOYEE_TEMPLATE = [
      ['ID', 'Nome', 'Email', 'Cargo', 'Departamento', 'Salário', 'NIF', 'Tipo de Contrato', 'Data de Início'],
      ['EMP001', 'João Silva', 'joao.silva@example.com', 'Software Engineer', 'Engineering', 85000, 'CV123456789', 'Full Time', '2024-01-15']
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(EMPLOYEE_TEMPLATE);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'employee_template.xlsx');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const existingIds = new Set(employees.map(emp => emp.employeeId));
        const duplicates = new Set();
        const newEmployees: Employee[] = [];

        jsonData.forEach((row: any) => {
          if (existingIds.has(row.ID)) {
            duplicates.add(row.ID);
          } else {
            newEmployees.push({
              id: Math.random().toString(36).substr(2, 9),
              employeeId: row.ID,
              name: row.Nome,
              email: row.Email,
              position: row.Cargo,
              department: row.Departamento,
              salary: Number(row.Salário),
              taxId: row.NIF,
              employmentType: row['Tipo de Contrato'],
              joinDate: row['Data de Início'],
              status: 'active'
            });
          }
        });

        if (duplicates.size > 0) {
          setUploadError(`IDs duplicados encontrados: ${Array.from(duplicates).join(', ')}`);
          return;
        }

        newEmployees.forEach(emp => addEmployee(emp));
        setUploadError(null);
      } catch (error) {
        setUploadError('Erro ao processar arquivo. Verifique se está usando o template correto.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleArchive = (employee: Employee) => {
    setEmployeeToArchive(employee);
    setShowArchiveDialog(true);
  };

  const confirmArchive = () => {
    if (employeeToArchive && archiveReason.trim()) {
      archiveEmployee(employeeToArchive.id, archiveReason);
      setShowArchiveDialog(false);
      setEmployeeToArchive(null);
      setArchiveReason('');
    }
  };

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  const archivedEmployees = employees.filter(emp => emp.status === 'archived');
  const displayedEmployees = showArchived ? archivedEmployees : activeEmployees;

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-400">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-400">⚠️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Erro ao carregar funcionários: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Funcionários</h1>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center px-3 py-1 rounded-md text-sm ${
              showArchived 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Users className="w-4 h-4 mr-1" />
            {showArchived ? 'Ver Ativos' : 'Ver Arquivados'}
          </button>
        </div>
        
        {!showArchived && (
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadTemplate}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FileDown className="w-5 h-5 mr-2" />
              Baixar Template
            </button>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <FileUp className="w-5 h-5 mr-2" />
                Importar Funcionários
              </button>
            </div>
            <button
              onClick={() => {
                setEditingEmployee(null);
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Adicionar Funcionário
            </button>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salário (CVE)
              </th>
              {showArchived && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Arquivamento
                </th>
              )}
              {!showArchived && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {employee.name}
                  </div>
                  <div className="text-sm text-gray-500">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{employee.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {employee.department}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatCurrency(employee.salary)}
                  </div>
                </td>
                {showArchived && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(employee.terminationDate!).toLocaleDateString()}
                      {employee.archiveReason && (
                        <div className="text-xs text-gray-400 mt-1">
                          Motivo: {employee.archiveReason}
                        </div>
                      )}
                    </div>
                  </td>
                )}
                {!showArchived && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleArchive(employee)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Archive className="w-5 h-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <EmployeeForm
          employee={editingEmployee || EMPTY_EMPLOYEE}
          onSubmit={(employee) => {
            if (editingEmployee) {
              updateEmployee(editingEmployee.id, employee);
            } else {
              addEmployee(employee);
            }
            setIsModalOpen(false);
            setEditingEmployee(null);
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingEmployee(null);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={showArchiveDialog}
        onClose={() => {
          setShowArchiveDialog(false);
          setEmployeeToArchive(null);
          setArchiveReason('');
        }}
        onConfirm={confirmArchive}
        title="Arquivar Funcionário"
        message="Esta ação irá arquivar o funcionário. Por favor, forneça um motivo para o arquivamento:"
        confirmLabel="Arquivar"
        confirmStyle="danger"
        showInput
        inputValue={archiveReason}
        onInputChange={(value) => setArchiveReason(value)}
        inputPlaceholder="Motivo do arquivamento"
      />
    </div>
  );
}