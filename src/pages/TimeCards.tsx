import React, { useState } from 'react';
import { FileDown, FileUp, Users, AlertCircle } from 'lucide-react';
import { useEmployeeStore } from '../stores/employeeStore';
import { SearchableEmployeeSelect } from '../components/SearchableEmployeeSelect';
import { TimeCardTable } from '../components/TimeCardTable';
import * as XLSX from 'xlsx';
import { TimeEntry } from '../types/timecard';

export function TimeCards() {
  const { employees } = useEmployeeStore();
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [uploadedPeriod, setUploadedPeriod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const downloadTemplate = (forAllEmployees = false) => {
    const template = [];
    const [year, month] = selectedPeriod.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const employeesToProcess = forAllEmployees ? employees : [selectedEmployee || employees[0] || { employeeId: 'EMP001', name: 'João Silva' }];
    
    for (const employee of employeesToProcess) {
      // Create template for each day of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        template.push({
          'ID Funcionário': employee.employeeId,
          'Nome': employee.name,
          'Data': `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          'Entrada': isWeekend ? 'Day Off' : '09:00',
          'Saída': isWeekend ? 'Day Off' : '18:00',
          'Total Horas': isWeekend ? '0.00' : '9.00',
          'Total Pausa': isWeekend ? '0.00' : '1.00',
          'Horas Extra': '0.00',
          'Status': isWeekend ? 'dayoff' : 'regular',
          'Observação': isWeekend ? 'Weekend' : ''
        });
      }
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    XLSX.utils.book_append_sheet(wb, ws, 'TimeCard');
    const filename = forAllEmployees ? 
      `timecard_all_employees_${selectedPeriod}.xlsx` : 
      `timecard_${selectedPeriod}_${selectedEmployee?.name || 'template'}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        setUploadError('O arquivo está vazio ou não contém dados válidos.');
        return;
      }

      // Validate data
      const errors = [];
      const entries: TimeEntry[] = [];
      let period: string | null = null;

      for (const row of jsonData) {
        const entry = row as any;
        
        // Check if employee exists
        const employee = employees.find(emp => 
          emp.employeeId === entry['ID Funcionário'] && 
          emp.name === entry['Nome']
        );

        if (!employee) {
          errors.push(`Funcionário não encontrado: ${entry['Nome']} (ID: ${entry['ID Funcionário']})`);
          continue;
        }

        // Extract period from the first entry
        if (!period && entry['Data']) {
          const [year, month] = entry['Data'].split('-');
          period = `${year}-${month}`;
        }

        // Skip validation for special statuses
        if (['Absent', 'Day Off'].includes(entry['Status'])) {
          entries.push({
            id: Math.random().toString(36).substr(2, 9),
            employeeId: employee.id,
            date: entry['Data'],
            status: entry['Status'].toLowerCase(),
            totalWork: 0,
            totalBreak: 0,
            totalOvertime: 0,
            edited: false,
            note: entry['Observação'] || ''
          });
          continue;
        }

        // Basic validation of required fields
        if (!entry['Entrada'] && entry['Saída']) {
          errors.push(`Horário de entrada ausente para ${entry['Data']}`);
          continue;
        }
        if (entry['Entrada'] && !entry['Saída']) {
          errors.push(`Horário de saída ausente para ${entry['Data']}`);
          continue;
        }

        // Convert time strings to minutes for calculations
        const clockIn = entry['Entrada'];
        const clockOut = entry['Saída'];
        const totalWork = parseFloat(entry['Total Horas']) * 60 || 0;
        const totalBreak = parseFloat(entry['Total Pausa']) * 60 || 0;
        const totalOvertime = parseFloat(entry['Horas Extra']) * 60 || 0;

        entries.push({
          id: Math.random().toString(36).substr(2, 9),
          employeeId: employee.id,
          date: entry['Data'],
          status: entry['Status'].toLowerCase(),
          clockIn,
          clockOut,
          totalWork,
          totalBreak,
          totalOvertime,
          edited: false,
          note: entry['Observação'] || ''
        });
      }

      if (errors.length > 0) {
        setUploadError(`Erros encontrados:\n${errors.join('\n')}`);
        return;
      }

      // Set the validated data
      setTimeEntries(entries);
      if (period) {
        setUploadedPeriod(period);
        setSelectedPeriod(period);
      }
      setUploadError(null);

      // Reset file input
      event.target.value = '';
    } catch (error) {
      setUploadError('Erro ao processar arquivo. Verifique se está usando o template correto.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cartão de Ponto</h1>
        <div className="flex items-center space-x-4">
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={() => downloadTemplate(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Users className="w-5 h-5 mr-2" />
            Template Todos
          </button>
          <button
            onClick={() => downloadTemplate(false)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!selectedEmployee}
            title={!selectedEmployee ? "Selecione um funcionário primeiro" : ""}
          >
            <FileDown className="w-5 h-5 mr-2" />
            Template Individual
          </button>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".xlsx,.xls"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            <button 
              className={`flex items-center px-4 py-2 text-white rounded-md ${
                isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={isProcessing}
            >
              <FileUp className="w-5 h-5 mr-2" />
              {isProcessing ? 'Processando...' : 'Importar Cartões'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Selecionar Funcionário
          </h2>
          {timeEntries.length > 0 && (
            <div className="text-sm text-gray-500">
              {timeEntries.length} registros importados
            </div>
          )}
        </div>
        
        <SearchableEmployeeSelect
          employees={employees}
          onSelect={setSelectedEmployee}
        />
        
        {selectedEmployee && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium">Funcionário Selecionado:</h3>
            <p className="text-gray-600">
              {selectedEmployee.name} (ID: {selectedEmployee.employeeId})
            </p>
            <p className="text-sm text-gray-500">
              {selectedEmployee.department} - {selectedEmployee.position}
            </p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 whitespace-pre-line">{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      {timeEntries.length > 0 && (
        <TimeCardTable 
          entries={timeEntries}
          employees={employees}
          period={uploadedPeriod || selectedPeriod}
          selectedEmployee={selectedEmployee}
        />
      )}
    </div>
  );
}