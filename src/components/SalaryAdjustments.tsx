import React, { useState } from 'react';
import { SalaryAdjustment } from '../types';
import { formatCurrency } from '../utils/calculations';

interface SalaryAdjustmentsProps {
  adjustments: SalaryAdjustment[];
  onChange: (adjustments: SalaryAdjustment[]) => void;
}

export function SalaryAdjustments({ adjustments = [], onChange }: SalaryAdjustmentsProps) {
  const [payPeriod, setPayPeriod] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const handleAddAdjustment = () => {
    const type = (document.getElementById('adjustment-type') as HTMLSelectElement).value as 'bonus' | 'deduction';
    const amount = Number((document.getElementById('adjustment-amount') as HTMLInputElement).value);
    const description = (document.getElementById('adjustment-description') as HTMLInputElement).value;
    const date = (document.getElementById('adjustment-date') as HTMLInputElement).value;

    if (!amount || !description || !date) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const newAdjustment: SalaryAdjustment = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      description,
      date,
      payPeriod,
      processed: false
    };

    onChange([...adjustments, newAdjustment]);

    // Reset fields
    (document.getElementById('adjustment-amount') as HTMLInputElement).value = '';
    (document.getElementById('adjustment-description') as HTMLInputElement).value = '';
    (document.getElementById('adjustment-date') as HTMLInputElement).value = '';
  };

  const handleRemoveAdjustment = (id: string) => {
    onChange(adjustments.filter(adj => adj.id !== id));
  };

  const activeAdjustments = adjustments.filter(adj => !adj.processed);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Ajustes Manuais</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Período de Pagamento:</label>
        <input
          type="month"
          value={payPeriod}
          onChange={(e) => setPayPeriod(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Os ajustes são aplicados apenas para o período selecionado e serão limpos após o processamento da folha.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              id="adjustment-type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="bonus">Bónus</option>
              <option value="deduction">Desconto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor (CVE)</label>
            <input
              type="number"
              id="adjustment-amount"
              min="0"
              placeholder="Digite o valor"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <input
              type="text"
              id="adjustment-description"
              placeholder="Digite a descrição"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input
              type="date"
              id="adjustment-date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleAddAdjustment}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Adicionar Ajuste
          </button>
        </div>
      </div>

      {activeAdjustments.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ajustes Atuais</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            {activeAdjustments.map((adjustment) => (
              <div
                key={adjustment.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <span className={`font-medium ${
                    adjustment.type === 'bonus' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {adjustment.type === 'bonus' ? '+' : '-'}{formatCurrency(adjustment.amount)}
                  </span>
                  <span className="ml-2 text-gray-600">{adjustment.description}</span>
                  <span className="ml-2 text-sm text-gray-500">{adjustment.date}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAdjustment(adjustment.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}