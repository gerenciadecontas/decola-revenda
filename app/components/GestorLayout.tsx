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
  Menu,
  X,
  History,
  Zap,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

interface GestorLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const mainMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin/implantacao-visao-geral', badge: undefined },
];

const operacaoMenuItems = [
  { id: 'implantacoes', label: 'Implantações', icon: Users, href: '/admin/implantacoes', badge: '12' },
  { id: 'treinamentos', label: 'Jornada de Capacitação', icon: Calendar, href: '/admin/treinamentos', badge: '24' },
];

const allMenuItems = [...mainMenuItems, ...operacaoMenuItems];

export function GestorLayout({ children, currentPage }: GestorLayoutProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  return (
    <div style={{ display: 'flex', height: '100vh', background: colors.background, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&display=swap');
        .sora { font-family: "Sora", sans-serif; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? 256 : 80,
          transition: 'width 0.3s',
          display: 'flex',
          flexDirection: 'column',
          background: isDark ? '#212329' : '#FFFFFF',
          borderRight: `1px solid ${isDark ? '#2D3038' : '#E5DCD2'}`,
          color: isDark ? '#fff' : colors.textPrimary,
          flexShrink: 0
        }}
      >
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? '16px' : '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(150deg, #8B5CF6, #6D28D9)',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                D
              </div>
              <div style={{ minWidth: 0 }}>
                <h1 className="sora" style={{ color: isDark ? '#fff' : '#1A1A1A', fontSize: '16px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1, margin: 0 }}>
                  Decola
                </h1>
                <p style={{ fontSize: '9px', color: isDark ? colors.textSecondary : '#999999', letterSpacing: '0.03em', textTransform: 'uppercase', margin: 0, fontWeight: 600, lineHeight: 1 }}>
                  Implantação
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(150deg, #8B5CF6, #6D28D9)',
                display: 'grid',
                placeItems: 'center',
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                color: '#fff',
                fontSize: '18px',
              }}
            >
              D
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded"
            style={{ background: 'transparent', border: 0, color: colors.textSecondary, cursor: 'pointer', flexShrink: 0 }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>




        {/* Menu */}
        <nav style={{ flex: 1, padding: sidebarOpen ? '24px 16px' : '24px 12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = true;
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: sidebarOpen ? '12px 16px' : '12px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  background: isActive ? (isDark ? '#8B5CF6' : '#E8E3F5') : 'transparent',
                  color: isActive ? (isDark ? '#fff' : '#7C5CF0') : (isDark ? colors.textSecondary : '#888888'),
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 500
                }}
                title={item.label}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={20} />
                  {sidebarOpen && <span style={{ fontSize: '14px' }}>{item.label}</span>}
                </div>
                {sidebarOpen && item.badge && (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isDark ? colors.textSecondary : '#999999'
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {sidebarOpen && (
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: isDark ? colors.textSecondary : '#999999',
              padding: '16px 4px 8px 4px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Operação
            </div>
          )}

          {operacaoMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: sidebarOpen ? '12px 16px' : '12px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  background: isActive ? (isDark ? '#8B5CF6' : '#E8E3F5') : 'transparent',
                  color: isActive ? (isDark ? '#fff' : '#7C5CF0') : (isDark ? colors.textSecondary : '#888888'),
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 500
                }}
                title={item.label}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={20} />
                  {sidebarOpen && <span style={{ fontSize: '14px' }}>{item.label}</span>}
                </div>
                {sidebarOpen && item.badge && (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isDark ? colors.textSecondary : '#999999'
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: colors.background }}>
        {/* Top Bar */}
        <div style={{
          background: isDark ? 'rgba(14,16,19,0.92)' : colors.background,
          borderBottom: `1px solid ${isDark ? '#1D2026' : '#E8E1D5'}`,
          backdropFilter: 'blur(8px)',
          padding: '16px 32px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 className="sora text-2xl font-bold" style={{ color: isDark ? '#fff' : colors.textPrimary, letterSpacing: '-0.02em' }}>
                {allMenuItems.find((item) => item.id === currentPage)?.label || 'Dashboard'}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{
                padding: '8px',
                borderRadius: '8px',
                background: isDark ? colors.cardBackground : colors.cardBackground,
                border: `1px solid ${isDark ? colors.borderColor : colors.borderColor}`,
                color: isDark ? colors.textPrimary : colors.textPrimary,
                cursor: 'pointer'
              }}>🔔</button>
              <button style={{
                padding: '8px',
                borderRadius: '8px',
                background: isDark ? colors.cardBackground : colors.cardBackground,
                border: `1px solid ${isDark ? colors.borderColor : colors.borderColor}`,
                color: isDark ? colors.textPrimary : colors.textPrimary,
                cursor: 'pointer'
              }}>⚙️</button>
              <button
                onClick={toggleTheme}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: isDark ? colors.cardBackground : colors.cardBackground,
                  border: `1px solid ${isDark ? colors.borderColor : colors.borderColor}`,
                  color: isDark ? colors.textPrimary : colors.textPrimary,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title={isDark ? 'Tema Claro' : 'Tema Escuro'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#fff',
                background: isDark ? 'linear-gradient(150deg, #8B5CF6, #6D28D9)' : 'linear-gradient(150deg, #7C5CF0, #5B4B9F)'
              }}>
                G
              </div>
            </div>
          </div>

          {/* Period Filters */}
          {currentPage === 'dashboard' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: colors.cardBackground,
              border: `1px solid ${isDark ? '#23262C' : colors.borderColor}`,
              borderRadius: '10px',
              padding: '3px',
              width: 'fit-content'
            }}>
              <button
                onClick={() => setPeriod('mes')}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: period === 'mes' ? (isDark ? '#FFC93C' : '#F5A623') : 'transparent',
                  color: period === 'mes' ? (isDark ? '#0E1013' : '#FFFFFF') : colors.textSecondary
                }}
              >
                Mês
              </button>
              <button
                onClick={() => setPeriod('trimestre')}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: period === 'trimestre' ? (isDark ? '#FFC93C' : '#F5A623') : 'transparent',
                  color: period === 'trimestre' ? (isDark ? '#0E1013' : '#FFFFFF') : colors.textSecondary
                }}
              >
                Trimestre
              </button>
              <button
                onClick={() => setPeriod('ano')}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: period === 'ano' ? (isDark ? '#FFC93C' : '#F5A623') : 'transparent',
                  color: period === 'ano' ? (isDark ? '#0E1013' : '#FFFFFF') : colors.textSecondary
                }}
              >
                Ano
              </button>
            </div>
          )}
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', background: colors.background }}>
          <div style={{ padding: '32px' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
