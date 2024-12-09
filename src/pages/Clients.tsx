import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import api from 'project/services/api';
import axios from 'axios';

type UpdateClientData = Partial<Omit<Client, 'id' | 'pets'>>;

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  ownerId: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  telefone: string;
  pets: Pet[];
  cpf?: string; // CPF como opcional
  rua?: string; // Rua como opcional
  complemento?: string; // Complemento como opcional
}

function Clients() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [mockClients, setMockClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]); // Lista filtrada de clientes
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  async function getClients() {
    try {
      const response = await api.get('/clients');
      console.log('Dados da API:', response.data);
      setMockClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setMockClients([]); // Para garantir que o estado seja um array
    }
  }

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    // Filtra os clientes com base no termo pesquisado (nome ou email)
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = mockClients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowercasedTerm) ||
        client.email.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredClients(results);
  }, [searchTerm, mockClients]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Notificação desaparece após 3 segundos
  };

  const handleAddPet = (clientId: string) => {
    setSelectedClientId(clientId);
    setIsPetModalOpen(true);
  };

  const handleAddPetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClientId) return;

    const formData = new FormData(e.currentTarget);
    const newPet = {
      name: formData.get('name') as string,
      species: formData.get('species') as string,
      breed: formData.get('breed') as string,
      age: Number(formData.get('age')),
    };

    try {
      console.log('selectedClientId:', selectedClientId);
      const response = await axios.post(
        `http://localhost:3000/clients/${selectedClientId}/pets`,
        newPet
      );
      const createdPet = response.data;

      // Atualiza a lista de clientes com o novo pet
      setMockClients((prevClients) =>
        prevClients.map((client) =>
          client.id === selectedClientId
            ? { ...client, pets: [...(client.pets || []), createdPet] }
            : client
        )
      );
      setIsPetModalOpen(false); // Fecha o modal
      showNotification('Pet adicionado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar pet:', error);
      showNotification('Erro ao adicionar pet.', 'error');
    }
  };

  const handleAddClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClient = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      telefone: formData.get('telefone') as string,
      cpf: formData.get('cpf') as string,
      rua: formData.get('rua') as string,
      complemento: formData.get('complemento') as string,
      pets: [], // Novo cliente começa sem pets
    };

    try {
      const response = await api.post('/clients', newClient);
      const createdClient = response.data;

      // Atualiza a lista de clientes com o novo cliente
      setMockClients((prevClients) => [...prevClients, createdClient]);
      showNotification('Cliente adicionado com sucesso!', 'success');
      setIsAddModalOpen(false); // Fecha o modal
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      showNotification('Erro ao adicionar cliente.', 'error');
    }
  };

  // Função para editar um cliente
  const handleEditClient = async (clientId: string, updatedData: UpdateClientData) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/clients/${clientId}`,
        updatedData
      );
      console.log('Cliente atualizado:', response.data);

      // Atualiza a lista de clientes após a edição
      getClients();
      showNotification('Cliente editado com sucesso!', 'success');
      setIsEditModalOpen(false); // Fecha o modal
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
      showNotification('Erro ao editar cliente.', 'error');
    }
  };

  // Função para abrir o modal de edição e carregar os dados do cliente
  const openEditModal = (client: Client) => {
    setClientToEdit(client); // Carrega os dados do cliente no estado
    setIsEditModalOpen(true); // Abre o modal
  };

  // Função para processar o envio do formulário de edição
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (clientToEdit) {
      const updatedData: UpdateClientData = {
        name: (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
        email: (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value,
        telefone: (e.currentTarget.elements.namedItem('telefone') as HTMLInputElement).value,
        cpf: (e.currentTarget.elements.namedItem('cpf') as HTMLInputElement).value,  // CPF
        rua: (e.currentTarget.elements.namedItem('rua') as HTMLInputElement).value,  // Rua
        complemento: (e.currentTarget.elements.namedItem('complemento') as HTMLInputElement).value,
      };
      handleEditClient(clientToEdit.id, updatedData); // Envia os dados atualizados
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const response = await axios.delete(`http://localhost:3000/clients/${clientId}`);
      console.log('Cliente deletado:', response.data);

      // Atualiza a lista de clientes após a remoção
      getClients();
      showNotification('Cliente deletado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      showNotification('Erro ao deletar cliente, verifique se ainda existem pets associados', 'error');
    }
  };

  // Na função que abre o modal de edição de pet
  const handleEditPet = (clientId: string) => {
    // Encontre o cliente selecionado pelo id
    const client = mockClients.find(client => client.id === clientId);
    
    if (client) {
      // Abrir o modal de edição de pets e definir o cliente e o pet a ser editado
      setSelectedClientId(client.id);  // Armazena o id do cliente selecionado
      setPetToEdit({
        ...client.pets[0]
      }) // Defina o primeiro pet (ou outro pet específico)
      setIsEditPetModalOpen(true);  // Abre o modal de edição de pet
    }
  };
  
  const handleEditPetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!petToEdit) return;
  
    const formData = new FormData(e.currentTarget);
    const updatedPet = {
      name: formData.get('name') as string,
      species: formData.get('species') as string,
      breed: formData.get('breed') as string,
      age: Number(formData.get('age')),
    };
  
    try {
      await axios.put(`http://localhost:3000/clients/${selectedClientId}/pets/${petToEdit.id}`, updatedPet);
      
      // Atualizar a lista de pets do cliente após a edição
      getClients();
      showNotification('Pet editado com sucesso!', 'success');
      setIsEditPetModalOpen(false);  // Fechar o modal
    } catch (error) {
      console.error('Erro ao editar pet:', error);
      showNotification('Erro ao editar pet.', 'error');
    }
  };
  const handleDeletePet = async (pet: Pet) => {
    try {
      await axios.delete(`http://localhost:3000/clients/${pet.ownerId}/pets/${pet.id}`);
      
      // Atualizar a lista de pets do cliente após a exclusão
      getClients();
      showNotification('Pet deletado com sucesso!', 'success');
      setIsEditPetModalOpen(false);  // Fechar o modal
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
      showNotification('Erro ao excluir pet.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clientes e Pets</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Novo Cliente
        </button>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Adicionar Novo Cliente</h2>
            <form onSubmit={(e) => handleAddClient(e)}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CPF</label>
                  <input
                    type="cpf"
                    name="cpf"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    <u>Endereço:</u>
                  </label>
                  <div>
                    <label htmlFor="rua" className="block text-sm font-medium text-gray-700">
                      Rua
                    </label>
                    <input
                      type="text"
                      name="rua"
                      id="rua"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      id="complemento"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar clientes..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Clients Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pets
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients && filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.telefone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {client.pets && Array.isArray(client.pets) && client.pets.length > 0 && client.pets.map((pet, petIndex) => (
                        <div key={petIndex} className="text-sm text-gray-500">
                          {pet.name} - {pet.species} ({pet.breed})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(client)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleAddPet(client.id.toString())}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       {/* Modal de Edição */}
       {isEditModalOpen && clientToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Editar Cliente</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={clientToEdit.name}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={clientToEdit.email}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    defaultValue={clientToEdit.telefone}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                </div>
                <div>
              <label className="block text-sm font-medium text-gray-700">CPF</label>
              <input
                type="text"
                name="cpf"
                defaultValue={clientToEdit.cpf}
                required
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rua</label>
              <input
                type="text"
                name="rua"
                defaultValue={clientToEdit.rua}
                required
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Complemento</label>
              <input
                type="text"
                name="complemento"
                defaultValue={clientToEdit.complemento}
                required
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Botão de Editar Pets */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => handleEditPet(clientToEdit?.id)} // Chama a função de edição de pet
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Editar Pets
            </button>
          </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
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
      {isPetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Adicionar Pet</h2>
            <form onSubmit={handleAddPetSubmit}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Espécie</label>
                  <select
                    name="species"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option>Cachorro</option>
                    <option>Gato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Raça</label>
                  <input
                    type="text"
                    name="breed"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Idade</label>
                  <input
                    type="number"
                    name="age"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPetModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
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
      {/* Modal de Edição de Pets */}
{/* Modal de Edição de Pet */}
{isEditPetModalOpen && petToEdit && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Editar Pet</h2>
      <form onSubmit={handleEditPetSubmit}>
        <div className="space-y-4">
          {/* Aqui você pode adicionar uma lista de pets do cliente e escolher qual pet editar */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Selecionar Pet</label>
            <select
              name="pet"
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => {
                console.log(e.target.value)
                const selectedPetId = e.target.value;
                const selectedPet = mockClients
                .find(client => client.id === selectedClientId)
                ?.pets.find(pet => pet.id === selectedPetId) || null;
                console.log(selectedPet)
                setPetToEdit(selectedPet); // Atualiza o estado com o pet selecionado
              }}
            >
              <option value="">Selecione um pet</option>
              {clientToEdit?.pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          {petToEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={petToEdit.name}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e)=>
                    setPetToEdit({
                      ...petToEdit,
                      name: e.target.value
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Espécie</label>
                <select
                  name="species"
                  value={petToEdit.species}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) =>
                    setPetToEdit({
                      ...petToEdit,
                      species: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione uma espécie</option>
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Raça</label>
                <input
                  type="text"
                  name="breed"
                  value={petToEdit.breed}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e)=>
                    setPetToEdit({
                      ...petToEdit,
                      breed: e.target.value
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Idade</label>
                <input
                  type="number"
                  name="age"
                  value={petToEdit.age}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e)=>
                    setPetToEdit({
                      ...petToEdit,
                      age: Number(e.target.value)
                    })
                  }
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsEditPetModalOpen(false)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => handleDeletePet(petToEdit!)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Excluir Pet
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

export default Clients;
