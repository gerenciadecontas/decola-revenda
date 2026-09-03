'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Calendar,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

interface PlatformLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/platform/dashboard' },
  { id: 'implantacoes', label: 'Implantações', icon: Users, href: '/platform/implantacoes' },
  { id: 'treinamentos', label: 'Jornada de capacitação', icon: Calendar, href: '/platform/treinamentos' },
];

export function PlatformLayout({ children, currentPage }: PlatformLayoutProps) {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: colors.background, fontFamily: '"Sora", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&display=swap');
        .sora { font-family: "Sora", sans-serif; }
      `}</style>

      {/* Sidebar */}
      <div
        style={{
          width: '256px',
          backgroundColor: colors.cardBackground,
          borderRight: `1px solid ${colors.borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          color: '#fff',
          margin: '16px',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          position: 'fixed',
          left: '16px',
          top: '16px',
          height: 'calc(100vh - 32px)',
          overflowY: 'auto'
        }}
      >
        {/* Logo Section */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#E6B23E',
                display: 'grid',
                placeItems: 'center',
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                color: '#1A1A1A',
                fontSize: '22px',
                flexShrink: 0
              }}
            >
              D
            </div>
            <div>
              <h1 style={{ fontFamily: '"Sora", sans-serif', fontSize: '18px', fontWeight: 'bold', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
                Decola
              </h1>
              <p style={{ fontSize: '10px', color: '#9CA3AF', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px', margin: 0 }}>
                Central de implantação
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? '#E6B23E' : 'transparent',
                  color: isActive ? '#1A1A1A' : colors.textSecondary,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={item.label}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: colors.background, minHeight: '100vh', marginLeft: '288px' }}>
        {/* Header/Top Bar */}
        <div style={{
          padding: '16px 32px',
          borderBottom: `1px solid ${colors.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '16px',
          background: colors.background,
          flexShrink: 0
        }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '10px 12px',
              background: isDark ? '#16181D' : '#FFFFFF',
              border: `1px solid ${colors.borderColor}`,
              borderRadius: '8px',
              color: colors.textSecondary,
              cursor: 'pointer',
              fontSize: '18px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
            title="Alternar tema"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
