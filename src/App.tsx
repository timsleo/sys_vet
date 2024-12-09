import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Reports from './pages/Reports';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import AccessDenied from './pages/AccessDenied'; 


function App() {
  const token = localStorage.getItem('token'); // Verifica se o usuário está autenticado

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública - Login */}
        <Route path="/" element={!token ? <Login /> : <Navigate to="/home" />} />

        {/* Rotas protegidas */}
        {token ? (
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients/*" element={<Clients />} />
            <Route path="appointments/*" element={<Appointments />} />
            <Route path="medical-records/*" element={<MedicalRecords />} />
            <Route path="reports" element={<Reports />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role={'ADMIN'}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>
        ) : null}

        {/* Página de Acesso Negado */}
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Redireciona qualquer rota inválida */}
        <Route path="*" element={<Navigate to={token ? '/home' : '/'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
