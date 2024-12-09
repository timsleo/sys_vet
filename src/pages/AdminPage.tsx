import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Trash2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

function AdminPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // ADMIN, VETERINARIAN, ATTENDANT, GROOMER
  const [crm, setCrm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [users, setUsers] = useState<User[]>([]); // Estado para os usuários
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Notificação desaparece após 3 segundos
  };

  // Função para buscar usuários
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

      // Verifique os dados antes de enviar
  console.log({
    name,
    email,
    password,
    role,
    crm: role === 'VETERINARIO' ? crm : '', // Apenas envia o CRM se for veterinário
  });

    try {
      await axios.post('http://localhost:3000/users/register', {
        name,
        email,
        password,
        role,
        ...(role === 'VETERINARIO' && { crm }),
      });

      showNotification('Usuário cadastrado com sucesso!', 'success');
      setName('');
      setEmail('');
      setPassword('');
      setRole('');
      setCrm(''); // Reseta o CRM
    } catch (error) {
        console.log(error)
      showNotification('Erro ao cadastrar usuário. Verifique os dados.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user); // Define o usuário a ser editado
  };
  
  const handleUpdateUser = async (updatedUser: Partial<User>) => {
    if (!userToEdit) return;
  
    try {
      await axios.put(`http://localhost:3000/users/${userToEdit.id}`, updatedUser);
      showNotification('Usuário atualizado com sucesso!', 'success');
      setUsers(users.map((user) => (user.id === userToEdit.id ? { ...user, ...updatedUser } : user))); // Atualiza localmente
      setUserToEdit(null); // Fecha o modal ou formulário
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      showNotification('Erro ao atualizar usuário.', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}`);
      showNotification('Usuário excluído com sucesso!', 'success');
      setUsers(users.filter((user) => user.id !== userId)); // Atualiza a tabela localmente
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      showNotification('Erro ao excluir usuário.', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 py-8 px-6">
      {/* Formulário de Cadastro */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-8 relative">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cadastro de Usuários</h2>
        <form onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cargo</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecione um cargo</option>
                <option value="ADMIN">Administrador</option>
                <option value="VETERINARIO">Veterinário</option>
                <option value="ATENDENTE">Atendente</option>
                <option value="TOSADOR">Banhista/Tosador</option>
              </select>
            </div>
            {role === 'VETERINARIO' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">CRMV</label>
                <input
                  type="text"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-lg ${
                isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? 'Carregando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Usuários Cadastrados</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nome</th>
              <th className="border border-gray-300 px-4 py-2">E-mail</th>
              <th className="border border-gray-300 px-4 py-2">Cargo</th>
              <th className="border border-gray-300 px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
  {users.length > 0 ? (
    users.map((user) => (
      <tr key={user.id}>
        <td className="border border-gray-300 px-4 py-2">{user.name}</td>
        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
        <td className="border border-gray-300 px-4 py-2">{user.role}</td>
        <td className="border border-gray-300 px-4 py-2 flex gap-2">
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => handleEditUser(user)}
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            className="text-red-600 hover:text-red-900"
            onClick={() => handleDeleteUser(user.id)}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="text-center p-4 text-gray-500">
        Nenhum usuário encontrado.
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
      {userToEdit && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Editar Usuário</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateUser({
            name: userToEdit.name,
            email: userToEdit.email,
            role: userToEdit.role,
          });
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={userToEdit.name}
              onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={userToEdit.email}
              onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cargo</label>
            <select
              value={userToEdit.role}
              onChange={(e) => setUserToEdit({ ...userToEdit, role: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ADMIN">Administrador</option>
              <option value="VETERINARIO">Veterinário</option>
              <option value="ATENDENTE">Atendente</option>
              <option value="TOSADOR">Banhista/Tosador</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setUserToEdit(null)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700"
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

export default AdminPage;
