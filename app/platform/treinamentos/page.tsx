'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import '@/app/globals.css';

const LIGHT_THEME = {
  background: '#F8F6F1',
  cardBg: '#FFFFFF',
  borderColor: '#E5DCD2',
  textPrimary: '#1A1A1A',
  textSecondary: '#888888',
  textTertiary: '#A4A8B3',
  purple: '#7C5CF0',
  yellow: '#E6B23E',
};

const DARK_THEME = {
  background: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#FFFFFF',
  textSecondary: '#A4A8B3',
  textTertiary: '#6B7280',
  purple: '#8B5CF6',
  yellow: '#E6B23E',
};

export default function JornadaCapacitacaoPage() {
  const { isDark } = useTheme();
  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <PlatformLayout currentPage="treinamentos">
      <div style={{ padding: '32px', background: theme.background, minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 8px 0' }}>
              Jornada de capacitação
            </h1>
            <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0 }}>
              24 sessões no trimestre · atualizado há 2 min
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              padding: '10px 20px',
              background: 'transparent',
              border: `1px solid ${theme.borderColor}`,
              borderRadius: '8px',
              color: theme.textPrimary,
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Exportar
            </button>
            <button style={{
              padding: '10px 20px',
              background: '#7C5CF0',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              + Agendar treinamento
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {/* Card 1 - Treinamentos */}
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>Treinamentos</p>
              <span style={{ fontSize: '12px', color: theme.textSecondary }}>+4</span>
            </div>
            <div style={{ fontSize: '40px', fontWeight: 700, color: theme.textPrimary, marginBottom: '8px' }}>24</div>
            <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>no trimestre</p>
          </div>

          {/* Card 2 - Concluídos (Amarelo) */}
          <div style={{
            background: isDark ? 'rgba(230, 178, 62, 0.1)' : 'rgba(230, 178, 62, 0.08)',
            border: `1px solid ${theme.yellow}`,
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>Concluídos</p>
              <span style={{ fontSize: '12px', background: theme.yellow, color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>67%</span>
            </div>
            <div style={{ fontSize: '40px', fontWeight: 700, color: theme.yellow, marginBottom: '8px' }}>16</div>
            <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>da meta trimestral</p>
          </div>

          {/* Card 3 - Em andamento (Lilás) */}
          <div style={{
            background: isDark ? 'rgba(123, 92, 240, 0.1)' : 'rgba(230, 212, 255, 0.5)',
            border: `1px solid ${isDark ? '#5B43C0' : '#DDD4E8'}`,
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>Em andamento</p>
              <span style={{ fontSize: '12px', color: isDark ? '#B7A8E6' : '#7C5CF0' }}>2 hoje</span>
            </div>
            <div style={{ fontSize: '40px', fontWeight: 700, color: isDark ? '#B7A8E6' : '#7C5CF0', marginBottom: '8px' }}>8</div>
            <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>com sessão marcada</p>
          </div>

          {/* Card 4 - Agentes treinados */}
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>Agentes treinados</p>
              <span style={{ fontSize: '12px', color: theme.textSecondary }}>+3</span>
            </div>
            <div style={{ fontSize: '40px', fontWeight: 700, color: theme.textPrimary, marginBottom: '8px' }}>12</div>
            <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>novos este mês</p>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
