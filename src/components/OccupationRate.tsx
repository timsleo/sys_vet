import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface OccupationEntry {
  period: string;
  consulta: number;
  banho: number;
  tosa: number;
  cirurgia: number;
  total: number;
  capacity: number;
}

const occupationData: OccupationEntry[] = [
  {
    period: 'Manhã',
    consulta: 8,
    banho: 4,
    tosa: 3,
    cirurgia: 2,
    total: 17,
    capacity: 20,
  },
  {
    period: 'Tarde',
    consulta: 6,
    banho: 5,
    tosa: 4,
    cirurgia: 1,
    total: 16,
    capacity: 20,
  },
  {
    period: 'Noite',
    consulta: 4,
    banho: 2,
    tosa: 1,
    cirurgia: 0,
    total: 7,
    capacity: 12,
  },
];

const serviceColors: Record<keyof Omit<OccupationEntry, 'period' | 'total' | 'capacity'>, string> = {
  consulta: '#4F46E5', // indigo-600
  banho: '#818CF8',    // indigo-400
  tosa: '#A5B4FC',     // indigo-300
  cirurgia: '#C7D2FE', // indigo-200
};

const calculateTotalOccupation = () => {
  const totalSlots = occupationData.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalOccupied = occupationData.reduce((acc, curr) => acc + curr.total, 0);
  return Math.round((totalOccupied / totalSlots) * 100);
};

const calculateAvailableSlots = () => {
  const totalSlots = occupationData.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalOccupied = occupationData.reduce((acc, curr) => acc + curr.total, 0);
  return totalSlots - totalOccupied;
};

function OccupationRate() {
  const totalOccupation = calculateTotalOccupation();
  const availableSlots = calculateAvailableSlots();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Taxa de Ocupação</h2>
        <PieChartIcon className="h-5 w-5 text-gray-400" />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-indigo-600">{totalOccupation}%</div>
          <div className="text-sm text-indigo-900">Ocupação Total</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-green-600">{availableSlots}</div>
          <div className="text-sm text-green-900">Slots Disponíveis</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">52</div>
          <div className="text-sm text-blue-900">Total do Dia</div>
        </div>
      </div>

      {/* Occupation Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={occupationData}
            layout="vertical"
            margin={{ top: 0, right: 0, left: 40, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 'dataMax']} />
            <YAxis dataKey="period" type="category" />
            <Tooltip
              formatter={(value, name:string) => [value, (name as string).charAt(0).toUpperCase() + (name as string).slice(1)]}
              labelFormatter={(label) => `Período: ${label}`}
            />
            <Legend />
            <Bar dataKey="consulta" stackId="a" fill={serviceColors.consulta} name="Consulta" />
            <Bar dataKey="banho" stackId="a" fill={serviceColors.banho} name="Banho" />
            <Bar dataKey="tosa" stackId="a" fill={serviceColors.tosa} name="Tosa" />
            <Bar dataKey="cirurgia" stackId="a" fill={serviceColors.cirurgia} name="Cirurgia" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(serviceColors).map(([service, color]) => (
          <div key={service} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm text-gray-600 capitalize">
              {service} ({occupationData.reduce((acc, curr) => acc + curr[service as keyof typeof serviceColors], 0)} slots)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OccupationRate;