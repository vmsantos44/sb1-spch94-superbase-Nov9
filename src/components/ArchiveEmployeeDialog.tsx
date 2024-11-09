import React, { useState } from 'react';

interface ArchiveEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  employeeName: string;
}

export function ArchiveEmployeeDialog({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
}: ArchiveEmployeeDialogProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Arquivar Funcionário
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Você está prestes a arquivar o funcionário <strong>{employeeName}</strong>. 
            Esta ação irá:
          </p>
          <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
            <li>Remover o funcionário da folha de pagamento ativa</li>
            <li>Manter todos os registros históricos</li>
            <li>Permitir acesso aos dados para referência futura</li>
          </ul>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Motivo do Arquivamento
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um motivo</option>
            <option value="Demissão">Demissão</option>
            <option value="Pedido de Demissão">Pedido de Demissão</option>
            <option value="Aposentadoria">Aposentadoria</option>
            <option value="Fim do Contrato">Fim do Contrato</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        {reason === 'Outro' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Especifique o Motivo
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              reason ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Confirmar Arquivamento
          </button>
        </div>
      </div>
    </div>
  );
}