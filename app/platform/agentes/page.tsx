'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';

const COLORS = {
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
};

export default function PageComponent() {
  const pageName = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
  const icons = {
    agenda: '📅',
    agentes: '👥',
    pendencias: '⚠️',
    alertas: '🔔',
    historico: '📜',
    relatorios: '📊',
    configuracoes: '⚙️'
  };

  return (
    <PlatformLayout currentPage={pageName || 'dashboard'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '48px 24px', textAlign: 'center', color: COLORS.textSecondary }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {icons[pageName as keyof typeof icons] || '📋'}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '8px', textTransform: 'capitalize' }}>
            {pageName}
          </h2>
          <p>Esta seção está em desenvolvimento</p>
        </div>
      </div>
    </PlatformLayout>
  );
}
