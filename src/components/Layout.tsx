import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3,
  PawPrint,
  Home,
  LogOut, 
  Shield
} from 'lucide-react';


function Layout() {
  const navigate = useNavigate();  // Usado para redirecionar o usuário para a página de login
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Limpa o token e outros dados
    localStorage.removeItem('role');
    console.log("Token removido");
    navigate('/login'); // Redireciona para a página de login
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2 text-indigo-600">
            <PawPrint className="h-8 w-8" />
            <span className="text-xl font-bold">VetCare Pro</span>
          </div>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                isActive ? 'bg-indigo-50 text-indigo-600' : ''
              }`
            }
          >
            <Home className="h-5 w-5" />
            Início
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                isActive ? 'bg-indigo-50 text-indigo-600' : ''
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                isActive ? 'bg-indigo-50 text-indigo-600' : ''
              }`
            }
          >
            <Users className="h-5 w-5" />
            Clientes e Pets
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                isActive ? 'bg-indigo-50 text-indigo-600' : ''
              }`
            }
          >
            <Calendar className="h-5 w-5" />
            Agendamentos
          </NavLink>
          <NavLink
            to="/medical-records"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                isActive ? 'bg-indigo-50 text-indigo-600' : ''
              }`
            }
          >
            <FileText className="h-5 w-5" />
            Histórico Médico
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                isActive ? 'bg-indigo-50 text-indigo-600' : ''
              }`
            }
          >
            <BarChart3 className="h-5 w-5" />
            Relatórios
          </NavLink>
          {role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : ''
                }`
              }
            >
              <Shield className="h-5 w-5" />
              Admin
            </NavLink>
          )}
        </nav>
        <div className="absolute bottom-4 left-0 w-full px-6 py-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-white bg-[#818cf8] rounded-lg hover:bg-indigo-500 mt-auto"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;