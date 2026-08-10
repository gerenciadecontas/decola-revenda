'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  AlertCircle,
  FileText,
  Settings,
  ChevronDown,
  Menu,
  X,
  History,
} from 'lucide-react';

type UserRole = 'gestor' | 'agente-canal';

interface PlatformLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/platform/dashboard' },
  { id: 'revendas', label: 'Revendas', icon: Building2, href: '/platform/revendas' },
  { id: 'implantacoes', label: 'Implantações', icon: Users, href: '/platform/implantacoes' },
  { id: 'treinamentos', label: 'Treinamentos', icon: Calendar, href: '/platform/treinamentos' },
  { id: 'agenda', label: 'Agenda', icon: Calendar, href: '/platform/agenda' },
  { id: 'agentes', label: 'Agentes', icon: Users, href: '/platform/agentes' },
  { id: 'pendencias', label: 'Pendências', icon: AlertCircle, href: '/platform/pendencias' },
  { id: 'alertas', label: 'Alertas', icon: AlertCircle, href: '/platform/alertas' },
  { id: 'historico', label: 'Histórico', icon: History, href: '/platform/historico' },
  { id: 'relatorios', label: 'Relatórios', icon: FileText, href: '/platform/relatorios' },
  { id: 'configuracoes', label: 'Configurações', icon: Settings, href: '/platform/configuracoes' },
];

export function PlatformLayout({ children, currentPage }: PlatformLayoutProps) {
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem('platformRole') as UserRole | null;
    setUserRoleState(savedRole || 'gestor');
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('platformRole', role);
  };

  if (userRole === null) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className={sidebarOpen ? '' : 'hidden'}>
            <h1 className="text-2xl font-bold">Decola</h1>
            <p className="text-xs text-gray-400">Central de Implantação</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-700 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Role Toggle */}
        <div className={`px-4 py-4 ${sidebarOpen ? '' : 'px-2'} border-t border-slate-700`}>
          <div className={`flex flex-col gap-2 ${sidebarOpen ? '' : 'items-center'}`}>
            <button
              onClick={() => setUserRole('gestor')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                userRole === 'gestor'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              } ${sidebarOpen ? '' : 'px-2 text-center'}`}
              title="Gestor"
            >
              {sidebarOpen ? '👨‍💼 Gestor' : '👨'}
            </button>
            <button
              onClick={() => setUserRole('agente-canal')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                userRole === 'agente-canal'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              } ${sidebarOpen ? '' : 'px-2 text-center'}`}
              title="Agente de Canal"
            >
              {sidebarOpen ? '🚀 Agente' : '🚀'}
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                } ${sidebarOpen ? '' : 'justify-center px-2'}`}
                title={item.label}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-slate-700 ${sidebarOpen ? '' : 'text-center'}`}>
          <p className="text-xs text-gray-400">
            {sidebarOpen ? `Logado como ${userRole === 'gestor' ? 'Gestor' : 'Agente'}` : '✓'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {menuItems.find((item) => item.id === currentPage)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">🔔</button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">⚙️</button>
            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              {userRole === 'gestor' ? 'G' : 'A'}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
