'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';

const COLORS = {
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
  purple: '#8B5CF6',
  yellow: '#FFC93C',
  green: '#34D399',
};

export default function TreinamentosPage() {
  return (
    <PlatformLayout currentPage="treinamentos">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '32px 24px', textAlign: 'center', color: COLORS.textSecondary }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '8px' }}>Treinamentos</h2>
          <p>Gestione e acompanhe todos os treinamentos programados</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: COLORS.textSecondary, marginBottom: '8px' }}>Treinamentos Agendados</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary }}>0</div>
          </div>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: COLORS.textSecondary, marginBottom: '8px' }}>Treinamentos Concluídos</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.green }}>0</div>
          </div>
        </div>

        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '32px 24px', textAlign: 'center', color: COLORS.textSecondary }}>
          Nenhum treinamento agendado
        </div>
      </div>
    </PlatformLayout>
  );
}
