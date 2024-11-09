import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { useEmployeeStore } from '../stores/employeeStore';
import { CustomPrompt } from '../components/CustomPrompt';

export function Dashboard() {
  const employees = useEmployeeStore((state) => state.employees);
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptSubmit = async (prompt: string) => {
    setIsLoading(true);
    try {
      // Handle the prompt submission here
      console.log('Processing prompt:', prompt);
      // Add your custom prompt handling logic
    } catch (error) {
      console.error('Error processing prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      name: 'Total Employees',
      value: employees.length,
      icon: Users,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Average Salary',
      value: `${Math.round(
        employees.reduce((acc, emp) => acc + emp.salary, 0) / employees.length
      ).toLocaleString()} CVE`,
      icon: DollarSign,
      change: '+2.1%',
      changeType: 'positive',
    },
    {
      name: 'Overtime Hours',
      value: '284h',
      icon: Clock,
      change: '-1.2%',
      changeType: 'negative',
    },
    {
      name: 'Total Payroll',
      value: `${Math.round(
        employees.reduce((acc, emp) => acc + emp.salary, 0)
      ).toLocaleString()} CVE`,
      icon: TrendingUp,
      change: '+3.2%',
      changeType: 'positive',
    },
  ];

  const chartData = [
    { month: 'Jan', payroll: 2400000 },
    { month: 'Feb', payroll: 2500000 },
    { month: 'Mar', payroll: 2300000 },
    { month: 'Apr', payroll: 2600000 },
    { month: 'May', payroll: 2800000 },
    { month: 'Jun', payroll: 2700000 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <CustomPrompt onSubmit={handlePromptSubmit} isLoading={isLoading} />
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden rounded-lg shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'positive'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Monthly Payroll Overview
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="payroll" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}