import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download } from 'lucide-react';

const revenueData = [
  { month: 'Jan', value: 12400 },
  { month: 'Fev', value: 11398 },
  { month: 'Mar', value: 19800 },
  { month: 'Abr', value: 13908 },
  { month: 'Mai', value: 14800 },
  { month: 'Jun', value: 13800 },
];

const appointmentData = [
  { day: 'Seg', value: 24 },
  { day: 'Ter', value: 18 },
  { day: 'Qua', value: 28 },
  { day: 'Qui', value: 22 },
  { day: 'Sex', value: 30 },
  { day: 'Sáb', value: 15 },
];

const serviceDistribution = [
  { name: 'Banho e Tosa', value: 45 },
  { name: 'Consultas', value: 25 },
  { name: 'Vacinas', value: 20 },
  { name: 'Cirurgias', value: 10 },
];

const COLORS = ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE'];

function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios e Indicadores</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Relatórios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Faturamento Mensal</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Agendamentos por Dia</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Distribuição de Serviços</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Métricas Principais</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Taxa de Ocupação Média</span>
              <span className="font-semibold">78%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Novos Clientes (Mês)</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Consultas Realizadas</span>
              <span className="font-semibold">312</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Ticket Médio</span>
              <span className="font-semibold">R$ 180,00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;