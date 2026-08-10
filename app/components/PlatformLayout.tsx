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
  Zap,
} from 'lucide-react';

type UserRole = 'gestor' | 'agente-canal';

interface PlatformLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const allMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/platform/dashboard', roles: ['gestor', 'agente-canal'] },
  { id: 'revendas', label: 'Revendas', icon: Building2, href: '/platform/revendas', roles: ['gestor'] },
  { id: 'implantacoes', label: 'Implantações', icon: Users, href: '/platform/implantacoes', roles: ['gestor', 'agente-canal'] },
  { id: 'treinamentos', label: 'Treinamentos', icon: Calendar, href: '/platform/treinamentos', roles: ['gestor', 'agente-canal'] },
  { id: 'agenda', label: 'Agenda', icon: Calendar, href: '/platform/agenda', roles: ['gestor'] },
  { id: 'agentes', label: 'Agentes', icon: Users, href: '/platform/agentes', roles: ['gestor'] },
  { id: 'pendencias', label: 'Pendências', icon: AlertCircle, href: '/platform/pendencias', roles: ['gestor'] },
  { id: 'alertas', label: 'Alertas', icon: AlertCircle, href: '/platform/alertas', roles: ['gestor'] },
  { id: 'historico', label: 'Histórico', icon: History, href: '/platform/historico', roles: ['gestor'] },
  { id: 'relatorios', label: 'Relatórios', icon: FileText, href: '/platform/relatorios', roles: ['gestor'] },
  { id: 'configuracoes', label: 'Configurações', icon: Settings, href: '/platform/configuracoes', roles: ['gestor'] },
];

const getMenuItems = (role: UserRole) => {
  return allMenuItems.filter(item => item.roles.includes(role));
};

export function PlatformLayout({ children, currentPage }: PlatformLayoutProps) {
  const [userRole, setUserRoleState] = useState<UserRole>('gestor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  useEffect(() => {
    const savedRole = localStorage.getItem('platformRole') as UserRole | null;
    if (savedRole) {
      setUserRoleState(savedRole);
    }
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('platformRole', role);
  };

  return (
    <div className="flex h-screen" style={{ background: '#0E1013', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&display=swap');
        .sora { font-family: "Sora", sans-serif; }
      `}</style>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } text-white transition-all duration-300 flex flex-col`}
        style={{ background: '#16181D', borderRight: '1px solid #23262C' }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between gap-3">
          <div className={sidebarOpen ? '' : 'hidden'}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                background: 'linear-gradient(150deg, #8B5CF6, #6D28D9)',
                display: 'grid',
                placeItems: 'center',
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                color: '#fff',
                fontSize: '18px',
                marginBottom: '8px',
              }}
            >
              D
            </div>
            <h1 className="sora text-xl font-bold" style={{ color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Decola
            </h1>
            <p style={{ fontSize: '11.5px', color: '#8A9099', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '3px' }}>
              Central de Implantação
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded"
            style={{ background: 'transparent', border: 0, color: '#6B7280', cursor: 'pointer' }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {getMenuItems(userRole).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${sidebarOpen ? '' : 'justify-center px-2'}`}
                style={{
                  background: isActive ? '#8B5CF6' : 'transparent',
                  color: isActive ? '#fff' : '#9AA1AA'
                }}
                title={item.label}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 ${sidebarOpen ? '' : 'text-center'}`} style={{ borderTop: '1px solid #23262C' }}>
          <p className="text-xs" style={{ color: '#8A9099' }}>
            {sidebarOpen ? `Logado como ${userRole === 'gestor' ? 'Gestor' : 'Agente'}` : '✓'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0E1013' }}>
        {/* Top Bar */}
        <div style={{ background: 'rgba(14,16,19,0.92)', borderBottom: '1px solid #1D2026', backdropFilter: 'blur(8px)' }} className="px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="sora text-2xl font-bold" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
                {allMenuItems.find((item) => item.id === currentPage)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm mt-1" style={{ color: '#8A9099' }}>Visão geral das implantações · atualizado há 4 min</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg" style={{ background: '#16181D', border: '1px solid #23262C', color: '#C9CED6' }}>🔔</button>
              <button className="p-2 rounded-lg" style={{ background: '#16181D', border: '1px solid #23262C', color: '#C9CED6' }}>⚙️</button>
              <div className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold" style={{ background: 'linear-gradient(150deg, #8B5CF6, #6D28D9)' }}>
                {userRole === 'gestor' ? 'G' : 'A'}
              </div>
            </div>
          </div>

          {/* Period Filters */}
          {currentPage === 'dashboard' && (
            <div className="flex items-center gap-2" style={{ background: '#16181D', border: '1px solid #23262C', borderRadius: '10px', padding: '3px', width: 'fit-content' }}>
              <button
                onClick={() => setPeriod('mes')}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: period === 'mes' ? '#FFC93C' : 'transparent',
                  color: period === 'mes' ? '#16181D' : '#9AA1AA'
                }}
              >
                Mês
              </button>
              <button
                onClick={() => setPeriod('trimestre')}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: period === 'trimestre' ? '#FFC93C' : 'transparent',
                  color: period === 'trimestre' ? '#16181D' : '#9AA1AA'
                }}
              >
                Trimestre
              </button>
              <button
                onClick={() => setPeriod('ano')}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: period === 'ano' ? '#FFC93C' : 'transparent',
                  color: period === 'ano' ? '#16181D' : '#9AA1AA'
                }}
              >
                Ano
              </button>
            </div>
          )}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8" style={{ background: '#0E1013' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
