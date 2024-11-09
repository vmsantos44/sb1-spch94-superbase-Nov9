import React, { useState } from 'react';
import { History, FileUp, FileDown } from 'lucide-react';
import { useEmployeeStore } from '../stores/employeeStore';
import { calculateSalary, formatCurrency } from '../utils/calculations';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PayrollHistory } from '../components/PayrollHistory';
import { PayrollPeriodDialog } from '../components/PayrollPeriodDialog';
import { NewEmployeesDialog } from '../components/NewEmployeesDialog';
import * as XLSX from 'xlsx';

export function Payroll() {
  const { employees, processPayroll, payrollHistory, addEmployee } = useEmployeeStore();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [showProcessConfirm, setShowProcessConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPeriodDialog, setShowPeriodDialog] = useState(false);
  const [uploadedData, setUploadedData] = useState<any[] | null>(null);
  const [newEmployees, setNewEmployees] = useState<any[]>([]);
  const [showNewEmployeesDialog, setShowNewEmployeesDialog] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isProcessed = payrollHistory.some(record => record.month === selectedMonth);

  const handleProcessPayroll = () => {
    processPayroll(selectedMonth);
    setShowProcessConfirm(false);
  };

  const downloadTemplate = () => {
    const template = [
      {
        'ID Funcionário': 'EMP001',
        'Nome': 'João Silva',
        'Email': 'joao.silva@example.com',
        'NIF': 'CV123456789',
        'Departamento': 'Engineering',
        'Cargo': 'Software Engineer',
        'Tipo de Contrato': 'Full Time',
        'Local de Trabalho': 'Praia',
        'Salário Base': '85000',
        'Subsídio Alimentação': '6500',
        'Subsídio Comunicação': '3500',
        'Prémio Assiduidade': '5000',
        'Prémio Produtividade': '5000',
        'Bónus': '0',
        'Deduções': '0'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'payroll_template.xlsx');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setUploadError('O arquivo está vazio ou não contém dados válidos.');
          return;
        }

        // Check for new employees
        const existingEmployeeIds = employees.map(emp => emp.employeeId);
        const newEmps = jsonData.filter((row: any) => 
          !existingEmployeeIds.includes(row['ID Funcionário'])
        );

        if (newEmps.length > 0) {
          setNewEmployees(newEmps);
          setShowNewEmployeesDialog(true);
        } else {
          setUploadedData(jsonData);
          setShowPeriodDialog(true);
        }
      } catch (error) {
        setUploadError('Erro ao processar o arquivo. Verifique se o formato está correto.');
      }
    };

    reader.onerror = () => {
      setUploadError('Erro ao ler o arquivo. Tente novamente.');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleNewEmployees = (completedEmployees: any[]) => {
    // Add new employees to the system
    completedEmployees.forEach(emp => {
      const newEmployee = {
        id: Math.random().toString(36).substr(2, 9),
        employeeId: emp['ID Funcionário'],
        name: emp['Nome'],
        email: emp.email,
        position: emp.position,
        salary: Number(emp['Salário Base']),
        taxId: emp.taxId,
        department: emp.department,
        employmentType: 'Full Time',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        foodAllowance: Number(emp['Subsídio Alimentação']),
        communicationAllowance: Number(emp['Subsídio Comunicação']),
        attendanceBonus: Number(emp['Prémio Assiduidade']),
        assiduityBonus: Number(emp['Prémio Produtividade'])
      };
      addEmployee(newEmployee);
    });

    setShowNewEmployeesDialog(false);
    setUploadedData(uploadedData);
    setShowPeriodDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Folha de Pagamento</h1>
        <div className="flex items-center space-x-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <History className="w-5 h-5 mr-2" />
            Histórico
          </button>
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
              Importar Folha
            </button>
          </div>
        </div>
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

      {/* Rest of the component remains the same */}

      <NewEmployeesDialog
        isOpen={showNewEmployeesDialog}
        onClose={() => setShowNewEmployeesDialog(false)}
        onConfirm={handleNewEmployees}
        employees={newEmployees}
      />

      <PayrollPeriodDialog
        isOpen={showPeriodDialog}
        onClose={() => setShowPeriodDialog(false)}
        onConfirm={(period) => {
          setSelectedMonth(period);
          setShowProcessConfirm(true);
          setShowPeriodDialog(false);
        }}
        selectedPeriod={selectedMonth}
        onPeriodChange={setSelectedMonth}
      />
    </div>
  );
}