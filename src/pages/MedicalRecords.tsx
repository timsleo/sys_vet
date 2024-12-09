import React, { useState, useEffect } from 'react';
import { Search, FileText, Syringe, Stethoscope, TestTube } from 'lucide-react';
import axios from 'axios';

interface MedicalRecord {
  id: string;
  date: string;
  petName: string;
  ownerName: string;
  type: string;
  description: string;
  vet: { name: string };
}

interface Pet {
  id: string;
  name: string;
}

interface Client {
  id: string;
  name: string;
}

interface Vet {
  id: string;
  name: string;
  role: string;
}

function MedicalRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]); // Registros filtrados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedVetId, setSelectedVetId] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null); // Para o modal
  

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Notificação desaparece após 3 segundos
  };


  const fetchMedicalRecords = async () => {
    try {
      const response = await axios.get('http://localhost:3000/medical-records');
      setMedicalRecords(response.data);
      setFilteredRecords(response.data); // Inicialmente exibe todos os registros
    } catch (error) {
      console.error('Erro ao buscar registros médicos:', error);
      showNotification('Erro ao buscar registros médicos', 'error');
    }
  };


  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const fetchVets = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const veterinarians = response.data.filter((user: Vet) => user.role === 'VETERINARIO');
      setVets(veterinarians);
    } catch (error) {
      console.error('Erro ao buscar veterinários:', error);
    }
  };
  useEffect(() => {
    fetchMedicalRecords();
    fetchClients();
    fetchVets();
  }, []);

  useEffect(() => {
    // Filtra os registros com base no termo pesquisado (nome do pet ou proprietário)
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = medicalRecords.filter(
      (record) =>
        record.petName.toLowerCase().includes(lowercasedTerm) ||
        record.ownerName.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredRecords(results);
  }, [searchTerm, medicalRecords]);


  const handleAddRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const newRecord = {
      date: new Date(date), // Certifique-se de que o formato da data está correto
      type,
      description,
      petId: selectedPetId, // ID do pet selecionado
      vetId: selectedVetId, // ID do veterinário selecionado
    };
  
    try {
      const response = await axios.post('http://localhost:3000/medical-records', newRecord);
      fetchMedicalRecords(); // Atualiza a lista de registros após adicionar um novo
      setIsModalOpen(false); // Fecha o modal
      showNotification("Registro médico criado com sucesso!", "success");
      console.log("Registro criado:", response.data);
    } catch (error) {
      console.error("Erro ao criar registro médico:", error);
      showNotification("Erro ao criar registro médico", "error");
    }
  };
  const handleClientChange = async (clientId: string) => {
    setSelectedClientId(clientId);

    try {
      const response = await axios.get(`http://localhost:3000/clients/${clientId}/pets`);
      setPets(response.data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/medical-records/${id}`);
      showNotification('Registro médico excluído com sucesso!', 'success');
      setSelectedRecord(null);
      fetchMedicalRecords(); // Atualiza a lista de registros
    } catch (error) {
      console.error('Erro ao excluir registro médico:', error);
      showNotification('Erro ao excluir registro médico.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Histórico Médico</h1>
        <div className="flex gap-2">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            onClick={() => setIsModalOpen(true)}
          >
            Novo Registro
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Exportar
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por pet ou proprietário..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Registros Filtrados */}
      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div key={record.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  {record.type === 'Consulta' && <Stethoscope className="h-6 w-6 text-indigo-600" />}
                  {record.type === 'Vacina' && <Syringe className="h-6 w-6 text-indigo-600" />}
                  {record.type === 'Exame' && <TestTube className="h-6 w-6 text-indigo-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {record.type} - {record.petName}
                      </h3>
                      <p className="text-sm text-gray-500">Proprietário: {record.ownerName}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{record.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Veterinário: {record.vet.name}</span>
                    <button
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      onClick={() => setSelectedRecord(record)}
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhum registro encontrado.</p>
        )}
      </div>
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Detalhes do Registro Médico</h2>
            <p><strong>Tipo:</strong> {selectedRecord.type}</p>
            <p><strong>Data:</strong> {new Date(selectedRecord.date).toLocaleDateString('pt-BR')}</p>
            <p><strong>Pet:</strong> {selectedRecord.petName}</p>
            <p><strong>Proprietário:</strong> {selectedRecord.ownerName}</p>
            <p><strong>Veterinário:</strong> {selectedRecord.vet.name}</p>
            <p><strong>Descrição:</strong> {selectedRecord.description}</p>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setSelectedRecord(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Fechar
              </button>
              <button
                onClick={() => handleDelete(selectedRecord.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Novo Registro Médico</h2>
            <form onSubmit={handleAddRecord}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione um tipo</option>
                    <option value="Consulta">Consulta</option>
                    <option value="Vacina">Vacina</option>
                    <option value="Exame">Exame</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => handleClientChange(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pet</label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione um pet</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Veterinário</label>
                  <select
                    value={selectedVetId}
                    onChange={(e) => setSelectedVetId(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione um veterinário</option>
                    {vets.map((vet) => (
                      <option key={vet.id} value={vet.id}>
                        {vet.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    </div>
  );
}

export default MedicalRecords;
