import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, Receipt, FileText, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Funcionários', href: '/employees', icon: Users },
    { name: 'Cartão de Ponto', href: '/timecard', icon: Clock },
    { name: 'Folha de Pagamento', href: '/payroll', icon: Receipt },
    { name: 'Relatórios', href: '/reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <div className="w-64 bg-blue-900 text-white">
          <div className="p-4">
            <h1 className="text-2xl font-bold">PayrollCV</h1>
          </div>
          <nav className="mt-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${
                    location.pathname === item.href
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-800'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 w-64 p-4">
            <button
              onClick={logout}
              className="flex w-full items-center px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-800 rounded"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}