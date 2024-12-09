import React, { useState } from 'react';
import { Search, Clock, CheckCircle, AlertCircle, Syringe, RotateCw } from 'lucide-react';
import OccupationRate from '../components/OccupationRate';

const upcomingAppointments = [
  { id: 1, time: '09:30', petName: 'Max', service: 'Consulta Rotina', client: 'João Silva', status: 'confirmed' },
  { id: 2, time: '10:00', petName: 'Luna', service: 'Vacinação', client: 'Maria Santos', status: 'waiting' },
  { id: 3, time: '11:30', petName: 'Thor', service: 'Exame', client: 'Pedro Costa', status: 'confirmed' },
  { id: 4, time: '14:00', petName: 'Bella', service: 'Cirurgia', client: 'Ana Oliveira', status: 'waiting' },
  { id: 5, time: '15:30', petName: 'Nina', service: 'Consulta', client: 'Carlos Souza', status: 'confirmed' },
];

const ongoingServices = [
  { id: 1, type: 'Cirurgia', petName: 'Rex', startTime: '08:45', duration: '2h', room: 'Sala 1' },
  { id: 2, type: 'Exame', petName: 'Mel', startTime: '09:15', duration: '1h', room: 'Sala 2' },
  { id: 3, type: 'Banho', petName: 'Bob', startTime: '09:30', duration: '45min', room: 'Banho 1' },
];

const reminders = [
  { id: 1, type: 'vaccine', title: 'Vacina Pendente', pet: 'Luna', description: 'Vacina V10 agendada para amanhã' },
  { id: 2, type: 'return', title: 'Retorno', pet: 'Max', description: 'Retorno pós-cirúrgico em 3 dias' },
  { id: 3, type: 'medication', title: 'Medicação', pet: 'Thor', description: 'Antibiótico às 14:00' },
];

function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Início</h1>
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar pacientes, clientes ou serviços..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Próximos Agendamentos</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horário</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{appointment.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{appointment.petName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{appointment.service}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{appointment.client}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.status === 'confirmed' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirmado
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Aguardando
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ongoing Services */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Em Andamento</h2>
            <RotateCw className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid gap-4">
            {ongoingServices.map((service) => (
              <div key={service.id} className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-indigo-900">{service.type}</h3>
                    <p className="text-sm text-indigo-700">{service.petName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-indigo-900">Início: {service.startTime}</p>
                    <p className="text-sm text-indigo-700">{service.room}</p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-indigo-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Occupation Rate */}
        <OccupationRate />

        {/* Reminders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Lembretes</h2>
            <AlertCircle className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full
                  ${reminder.type === 'vaccine' ? 'bg-blue-100' : 
                    reminder.type === 'return' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {reminder.type === 'vaccine' ? (
                    <Syringe className={`h-5 w-5 ${reminder.type === 'vaccine' ? 'text-blue-600' : 
                      reminder.type === 'return' ? 'text-green-600' : 'text-yellow-600'}`} />
                  ) : reminder.type === 'return' ? (
                    <RotateCw className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                  <p className="text-sm text-gray-600">{reminder.pet}</p>
                  <p className="text-sm text-gray-500 mt-1">{reminder.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;