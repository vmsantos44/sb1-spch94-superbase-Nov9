import React from 'react';

interface PayrollPeriodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (period: string) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export function PayrollPeriodDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedPeriod,
  onPeriodChange,
}: PayrollPeriodDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Selecionar Período da Folha
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período de Processamento
          </label>
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-2 text-sm text-gray-500">
            Selecione o mês e ano para processar a folha de pagamento
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(selectedPeriod)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}