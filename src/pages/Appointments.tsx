import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

type Client = {
  id: string;
  name: string;
};

type Pet = {
  id: string;
  name: string;
};

type Appointment = {
  id: string;
  date: Date; // Pode ser Date ou string, dependendo de como você lida com o formato
  service: string;
  petName: string;
  clientName: string;
  petId: string;
  clientId: string;
};
function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null); // Agendamento selecionado
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Notificação desaparece após 3 segundos
  };

  const fetchClients = async (query: string) => {
    if (query.length < 2){
      setClients([]);
      return;
    }
  
    try {
  
    const response = await fetch(`http://localhost:3000/clients?name=${query}`);
    const data = await response.json();
    setClients(data); // Atualiza a lista de clientes
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
  }
    
  };

  const fetchPets = async (clientId: string) => {
    const response = await fetch(`http://localhost:3000/clients/${clientId}/pets`);
    const data = await response.json();
    setPets(data); // Atualiza a lista de pets
  };
  
  useEffect(() => {
    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:3000/appointments'); // Certifique-se que a URL está correta
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
        }
    };

    fetchAppointments();
}, []);

  const weekDays = [...Array(7)].map((_, i) => addDays(currentWeek, i));

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTime(null); // Reseta o horário
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Dados do novo agendamento
      const formData = new FormData(e.currentTarget);
      const time = formData.get('time') as string;
      const service = formData.get('service') as string;

      console.log("Pet Name enviado:", selectedPet?.name);
      const newAppointment = {
          date: new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              parseInt(time.split(':')[0]),
              parseInt(time.split(':')[1])
          ),
          clientId: selectedClient!.id,
          petId: selectedPet!.id,
          petName: selectedPet!.name,
          clientName: selectedPet!.name,
          service,
      };
  
      try {
          await fetch('http://localhost:3000/appointments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newAppointment),
          });
  
          // Atualiza a lista de agendamentos após salvar
          const response = await fetch('http://localhost:3000/appointments');
          const updatedAppointments = await response.json();
          setAppointments(updatedAppointments);
  
          setIsModalOpen(false); // Fecha o modal
          setSelectedTime(null); // Reseta o horário
          showNotification("Agendamento criado com sucesso!", "success");
      } catch (error) {
          console.error('Erro ao salvar agendamento:', error);
          showNotification("Erro ao criar agendamento. Tente novamente.", "error");
      }
  };
  

    const handlePetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedPetId = e.target.value;
      // Encontrar o pet na lista de pets
      const pet = pets.find(pet => pet.id === String(selectedPetId)) || null;
      console.log("Selected Pet:", pet);
      setSelectedPet(pet);
    };
    
    const getServiceColor = (service: string) => {
      switch (service) {
        case 'Consulta de Rotina':
          return 'bg-[#FFFACD] border-[#FFFACD] text-white';
        case 'Banho e Tosa':
          return 'bg-blue-50 border-blue-100 text-blue-900';
        case 'Vacinação':
          return 'bg-[#A5B4FC] border-[#A5B4FC] text-white';
        default:
          return 'bg-gray-50 border-gray-100 text-gray-900';
      }
    };
    
    const handleEditAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); 
      if (!selectedAppointment) {
        console.error('No appointment selected');
        return; // Ou talvez algum outro comportamento apropriado
      }
      const formData = new FormData(e.currentTarget);

      // Garantir que selectedAppointment.date seja um objeto Date
      const selectedDate = new Date(selectedAppointment.date);

      const updatedData = {
        ...selectedAppointment,
        date: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          parseInt(formData.get('time')?.toString().split(':')[0] || '0'),
          parseInt(formData.get('time')?.toString().split(':')[1] || '0')
        ),
        service: formData.get('service')?.toString(),
      };
  
      try {
        await fetch(`http://localhost:3000/appointments/${selectedAppointment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
  
        // Recarregar agendamentos
        const response = await fetch('http://localhost:3000/appointments');
        const updatedAppointments = await response.json();
        setAppointments(updatedAppointments);
  
        setIsEditModalOpen(false); // Fechar modal
        showNotification("Agendamento editado com sucesso!", "success");
      } catch (error) {
        console.error('Erro ao editar agendamento:', error);
        showNotification("Erro ao editar agendamento. Tente novamente.", "error");
      }
    };
  
    const handleDeleteAppointment = async (appointmentId: string) => {
      try {
        await fetch(`http://localhost:3000/appointments/${appointmentId}`, {
          method: 'DELETE',
        });
  
        // Recarregar agendamentos
        const response = await fetch('http://localhost:3000/appointments');
        const updatedAppointments = await response.json();
        setAppointments(updatedAppointments);
  
        setIsEditModalOpen(false); // Fechar modal
        showNotification("Agendamento excluído com sucesso!", "success");
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        showNotification("Erro ao excluir agendamento. Tente novamente.", "error");
      }
    };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
        <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Novo Agendamento
        </button>
      </div>
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white ${
            notification.type === 'success'
              ? 'bg-green-500'
              : notification.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
        >
          {notification.message}
        </div>
      )}
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => setCurrentWeek(date => addDays(date, -7))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="grid grid-cols-7 gap-4 flex-1 text-center">
          {weekDays.map((date, i) => (
            <div
              key={i}
              className={`cursor-pointer p-2 rounded-lg ${
                isSameDay(date, selectedDate)
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="text-xs font-medium">
                {format(date, 'EEE', { locale: ptBR })}
              </div>
              <div className="text-lg font-semibold">
                {format(date, 'd')}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentWeek(date => addDays(date, 7))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Time Slots Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 divide-y">
          {timeSlots.map((time, i) => (
            <div key={i} className="p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{time}</span>
                <div className="ml-4 flex-1 grid grid-cols-1 gap-2">
                  {appointments
                    .filter((apt) => 
                      isSameDay(apt.date, selectedDate) && 
                      format(apt.date, 'HH:mm') === time
                    ) 
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className={`cursor-pointer ${getServiceColor(apt.service)} p-3 rounded-lg`}
                        onClick={() => {
                          setSelectedAppointment(apt); // Selecionar agendamento
                          setIsEditModalOpen(true); // Abrir modal
                        }}
                      >
                        <div className="font-medium text-indigo-900">{apt.petName || "Sem nome do pet"}</div>
                        <div className="text-sm text-indigo-700">{apt.service}</div>
                      </div>
                    ))}
                </div>
                <button
                  className="ml-4 text-sm text-indigo-600 hover:text-indigo-800"
                  onClick={() => {
                    setSelectedTime(time); // Define o horário clicado
                    setIsModalOpen(true);  // Abre o modal
                  }}
                >
                  + Agendar horário
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Novo Agendamento</h2>
      
      {/* Formulário */}
      <form
        onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome do Cliente
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={async (e) => {
                const value = e.target.value;
                setSearchTerm(value); // Atualiza o termo de busca
                if (value.length >= 2) {
                  await fetchClients(value); // Busca apenas após 2 caracteres
                }
              }}
              value={searchTerm}
              required
            />
            <ul className="bg-white border border-gray-300 mt-2 rounded-lg shadow-sm">
                {clients.map((client) => (
                  <li
                    key={client.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedClient(client);
                      setSearchTerm(client.name); // Atualiza o campo com o nome selecionado
                      fetchPets(client.id); // Busca os pets
                      setClients([]); // Limpa as sugestões
                    }}
                  >
                    {client.name}
                  </li>
                ))}
              </ul>
          </div>
          {selectedClient && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome do Pet
            </label>
            <select 
            value={selectedPet?.id || ''} 
            onChange={handlePetChange}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm">
              <option value="">Selecione um pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
              </div>
            )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Serviço
            </label>
            <select
              name="service"
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="Consulta de Rotina">Consulta de Rotina</option>
              <option value="Banho e Tosa">Banho e Tosa</option>
              <option value="Vacinação">Vacinação</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Horário
            </label>
            <select
              name="time"
              value={selectedTime || ''} // Preenche com o horário selecionado
              onChange={(e) => setSelectedTime(e.target.value)} // Permite alterar manualmente
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleCloseModal}
            className="mr-4 px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{/* Modal de edição */}
{isEditModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Editar Agendamento</h2>
            <form onSubmit={handleEditAppointment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Serviço
                  </label>
                  <select
                    name="service"
                    defaultValue={selectedAppointment.service}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
                    required
                  >
                    <option value="Consulta de Rotina">Consulta de Rotina</option>
                    <option value="Banho e Tosa">Banho e Tosa</option>
                    <option value="Vacinação">Vacinação</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Horário
                  </label>
                  <select
                    name="time"
                    defaultValue={format(new Date(selectedAppointment.date), 'HH:mm')}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
                    required
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                  className="px-4 py-2 text-sm text-red-700 bg-red-100 rounded-lg"
                >
                  Excluir
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;