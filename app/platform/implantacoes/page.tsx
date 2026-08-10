'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';

const COLORS = {
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
  purple: '#8B5CF6',
};

export default function ImplantacoesPage() {
  return (
    <PlatformLayout currentPage="implantacoes">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '32px 24px', textAlign: 'center', color: COLORS.textSecondary }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '8px' }}>Implantações</h2>
          <p>Acompanhe o progresso de todas as implantações em andamento</p>
        </div>

        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', padding: '16px 24px', background: 'rgba(0,0,0,0.2)', borderBottom: `1px solid ${COLORS.borderColor}`, fontSize: '12px', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            <div>Projeto</div>
            <div>Progresso</div>
            <div>Prazo</div>
            <div>Status</div>
          </div>
          <div style={{ padding: '32px', textAlign: 'center', color: COLORS.textSecondary }}>
            Carregando dados de implantações...
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
