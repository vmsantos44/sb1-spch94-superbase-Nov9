import React from 'react';
import { Employee, SalaryAdjustment } from '../types';
import { calculateSalary, formatCurrency, formatNumberInWords } from '../utils/calculations';

interface SalaryBreakdownProps {
  employee: Employee;
  adjustments?: SalaryAdjustment[];
}

export function SalaryBreakdown({ employee, adjustments = [] }: SalaryBreakdownProps) {
  const salary = calculateSalary(employee, adjustments);
  const totalBonuses = adjustments
    ?.filter(adj => adj.type === 'bonus' && !adj.processed)
    .reduce((sum, adj) => sum + adj.amount, 0) || 0;
  const totalDeductions = adjustments
    ?.filter(adj => adj.type === 'deduction' && !adj.processed)
    .reduce((sum, adj) => sum + adj.amount, 0) || 0;

  return (
    <div className="mt-6 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Demonstrativo Salarial</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Salário Base</span>
          <span className="font-medium">{formatCurrency(employee.salary)}</span>
        </div>

        <div className="border-t pt-2">
          <p className="font-medium mb-2">Subsídios e Bónus:</p>
          <div className="space-y-1 ml-4">
            <div className="flex justify-between">
              <span>- Subsídio de Alimentação</span>
              <span>{formatCurrency(6500)}</span>
            </div>
            <div className="flex justify-between">
              <span>- Subsídio de Comunicação</span>
              <span>{formatCurrency(3500)}</span>
            </div>
            <div className="flex justify-between">
              <span>- Prémio de Assiduidade</span>
              <span>{formatCurrency(5000)}</span>
            </div>
            <div className="flex justify-between">
              <span>- Prémio de Produtividade</span>
              <span>{formatCurrency(5000)}</span>
            </div>
            {totalBonuses > 0 && (
              <div className="flex justify-between text-green-600">
                <span>- Bónus Adicionais</span>
                <span>{formatCurrency(totalBonuses)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between font-medium border-t pt-2">
          <span>Total de Subsídios e Bónus</span>
          <span>{formatCurrency(20000 + totalBonuses)}</span>
        </div>

        <div className="flex justify-between font-medium border-t pt-2">
          <span>Salário Bruto</span>
          <span>{formatCurrency(employee.salary + 20000 + totalBonuses)}</span>
        </div>

        <div className="border-t pt-2">
          <p className="font-medium mb-2">Descontos:</p>
          <div className="space-y-1 ml-4">
            <div className="flex justify-between text-red-600">
              <span>- IRPS (Imposto sobre Rendimento)</span>
              <span>-{formatCurrency(salary.incomeTax)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>- Segurança Social ({employee.employmentType === 'Estagiário(a)' ? '8%' : '8.5%'})</span>
              <span>-{formatCurrency(salary.socialSecurity)}</span>
            </div>
            {totalDeductions > 0 && (
              <div className="flex justify-between text-red-600">
                <span>- Descontos Manuais</span>
                <span>-{formatCurrency(totalDeductions)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between font-medium text-red-600 border-t pt-2">
          <span>Total de Descontos</span>
          <span>-{formatCurrency(salary.incomeTax + salary.socialSecurity + totalDeductions)}</span>
        </div>

        <div className="flex flex-col border-t border-t-2 pt-2">
          <div className="flex justify-between text-lg font-bold">
            <span>Salário Líquido</span>
            <span>{formatCurrency(salary.net - totalDeductions + totalBonuses)}</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {formatNumberInWords(salary.net - totalDeductions + totalBonuses)}
          </div>
        </div>
      </div>
    </div>
  );
}