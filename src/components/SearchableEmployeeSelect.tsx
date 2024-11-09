import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Employee } from '../types';

interface SearchableEmployeeSelectProps {
  employees: Employee[];
  onSelect: (employee: Employee) => void;
}

export function SearchableEmployeeSelect({ employees, onSelect }: SearchableEmployeeSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredEmployees = employees
    .filter(emp => {
      if (!searchTerm) return true;
      
      const search = searchTerm.toLowerCase();
      const nameMatch = emp?.name?.toLowerCase?.()?.includes(search) || false;
      const idMatch = String(emp?.employeeId || '').toLowerCase().includes(search);
      const deptMatch = emp?.department?.toLowerCase?.()?.includes(search) || false;
      
      return nameMatch || idMatch || deptMatch;
    })
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar por nome, ID ou departamento..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <button
                key={employee.id}
                onClick={() => {
                  onSelect(employee);
                  setSearchTerm('');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{employee.name}</span>
                  <span className="text-sm text-gray-500">ID: {employee.employeeId}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {employee.department} - {employee.position}
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Nenhum funcionário encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}