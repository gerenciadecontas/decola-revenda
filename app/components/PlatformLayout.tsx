'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

interface PlatformLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/platform/dashboard' },
  { id: 'implantacoes', label: 'Implantações', icon: Users, href: '/platform/implantacoes' },
  { id: 'treinamentos', label: 'Treinamentos', icon: Calendar, href: '/platform/treinamentos' },
];

export function PlatformLayout({ children, currentPage }: PlatformLayoutProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  return (
    <div className="flex min-h-screen w-full" style={{ background: colors.background, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&display=swap');
        .sora { font-family: "Sora", sans-serif; }
      `}</style>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } text-white transition-all duration-300 flex flex-col shrink-0`}
        style={{ background: colors.cardBackground, borderRight: `1px solid ${colors.borderColor}` }}
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
            <p style={{ fontSize: '11.5px', color: '#9CA3AF', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '3px' }}>
              Central de Implantação
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded"
            style={{ background: 'transparent', border: 0, color: colors.textSecondary, cursor: 'pointer' }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${sidebarOpen ? '' : 'justify-center px-2'}`}
                style={{
                  background: isActive ? '#8B5CF6' : 'transparent',
                  color: isActive ? '#fff' : colors.textSecondary
                }}
                title={item.label}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: colors.background, minHeight: '100vh' }}>
        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
