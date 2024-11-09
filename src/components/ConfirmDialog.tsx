import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmStyle?: 'danger' | 'primary';
  showInput?: boolean;
  inputLabel?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmLabel = 'Confirm',
  confirmStyle = 'primary',
  showInput = false,
  inputLabel = '',
  inputValue = '',
  onInputChange
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    primary: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        
        {showInput && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {inputLabel}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            onClick={onConfirm}
            disabled={showInput && !inputValue}
            className={`px-4 py-2 text-sm font-medium text-white ${buttonStyles[confirmStyle]} rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}