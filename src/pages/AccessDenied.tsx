import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Acesso Negado</h1>
        <p className="text-gray-700 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <Link
          to="/"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
