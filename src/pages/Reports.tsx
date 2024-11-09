import React, { useState } from 'react';
import { useEmployeeStore } from '../stores/employeeStore';
import { FileText, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { calculateSalary, formatCurrency } from '../utils/calculations';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export function Reports() {
  const { employees } = useEmployeeStore();
  const [reportType, setReportType] = useState('department');

  const departmentAnalytics = employees.reduce((acc: any, employee) => {
    const dept = acc[employee.department] || {
      name: employee.department,
      employeeCount: 0,
      totalSalary: 0,
      totalOvertime: 0,
      averageSalary: 0,
    };

    const salary = calculateSalary(employee);
    dept.employeeCount++;
    dept.totalSalary += salary.gross;
    dept.totalOvertime += salary.overtime;
    dept.averageSalary = dept.totalSalary / dept.employeeCount;

    acc[employee.department] = dept;
    return acc;
  }, {});

  const departmentData = Object.values(departmentAnalytics);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  const downloadReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Department Analytics Report', 20, 20);
    
    // Department table
    const tableData = departmentData.map((dept: any) => [
      dept.name,
      dept.employeeCount,
      formatCurrency(dept.totalSalary),
      formatCurrency(dept.averageSalary),
      formatCurrency(dept.totalOvertime),
    ]);

    doc.autoTable({
      startY: 30,
      head: [['Department', 'Employees', 'Total Salary', 'Avg Salary', 'Overtime']],
      body: tableData,
    });

    doc.save(`department-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex items-center space-x-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="department">Department Analysis</option>
            <option value="salary">Salary Distribution</option>
          </select>
          <button
            onClick={downloadReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Employee Distribution by Department
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  dataKey="employeeCount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {departmentData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [value, 'Employees']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Total Salary by Department
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="totalSalary" fill="#3B82F6" name="Total Salary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Department Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Overtime
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentData.map((dept: any) => (
                <tr key={dept.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dept.employeeCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(dept.totalSalary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(dept.averageSalary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(dept.totalOvertime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}