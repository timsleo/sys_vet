import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 2400 },
  { name: 'Fev', value: 1398 },
  { name: 'Mar', value: 9800 },
  { name: 'Abr', value: 3908 },
  { name: 'Mai', value: 4800 },
  { name: 'Jun', value: 3800 },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-semibold mt-1">1,248</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500 ml-1">12%</span>
            <span className="text-gray-600 ml-2">vs último mês</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Agendamentos Hoje</p>
              <p className="text-2xl font-semibold mt-1">32</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500 ml-1">8%</span>
            <span className="text-gray-600 ml-2">vs ontem</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Faturamento Mensal</p>
              <p className="text-2xl font-semibold mt-1">R$ 42.890</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowDown className="h-4 w-4 text-red-500" />
            <span className="text-red-500 ml-1">3%</span>
            <span className="text-gray-600 ml-2">vs último mês</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Ocupação</p>
              <p className="text-2xl font-semibold mt-1">78%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500 ml-1">5%</span>
            <span className="text-gray-600 ml-2">vs média</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Faturamento por Mês</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;