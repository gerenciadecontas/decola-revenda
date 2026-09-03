'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import '@/app/globals.css';

interface Treinamento {
  revenda: string;
  sigla: string;
  modulo: string;
  quando: string;
  instrutor: string;
  status: 'Confirmado' | 'A confirmar' | 'Reagendar';
}

const treinamentos: Treinamento[] = [
  { revenda: 'Distribuidora Aurora', sigla: 'DA', modulo: 'Módulo Fiscal', quando: '28/08 · 14:00', instrutor: 'Carla Mendes', status: 'Confirmado' },
  { revenda: 'Casa & Cia Materiais', sigla: 'CC', modulo: 'Onboarding PDV', quando: '29/08 · 09:30', instrutor: 'Roberto Alves', status: 'Confirmado' },
  { revenda: 'Papelaria Central', sigla: 'PC', modulo: 'Estoque avançado', quando: '01/09 · 16:00', instrutor: 'Diego Ramos', status: 'A confirmar' },
  { revenda: 'Supermercado União', sigla: 'SU', modulo: 'Relatórios', quando: '02/09 · 10:00', instrutor: 'Paulo Freitas', status: 'Confirmado' },
  { revenda: 'Auto Peças Bandeirantes', sigla: 'AB', modulo: 'Módulo Fiscal', quando: '03/09 · 15:00', instrutor: 'Ana Prado', status: 'Reagendar' },
];

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

export default function TreinamentosPage() {
  const { isDark } = useTheme();
  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  const getStatusColor = (status: string) => {
    if (status === 'Confirmado') return theme.purple;
    if (status === 'A confirmar') return theme.yellow;
    if (status === 'Reagendar') return theme.yellow;
    return theme.textSecondary;
  };

  return (
    <PlatformLayout currentPage="treinamentos">
      <div style={{ padding: '32px', background: theme.background, minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 8px 0' }}>
              Treinamentos
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

        {/* Próximos Treinamentos */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Próximos treinamentos</h3>
            <span style={{ fontSize: '12px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', padding: '4px 12px', borderRadius: '6px', color: theme.textSecondary }}>5 agendados</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <button style={{ padding: '6px 16px', background: 'transparent', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Semana</button>
            <button style={{ padding: '6px 16px', background: 'transparent', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Mês</button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
                  <th style={{ textAlign: 'left', padding: '16px 0', fontSize: '11px', color: isDark ? '#E6B23E' : '#9AA1AA', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>REVENDA</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '11px', color: isDark ? '#E6B23E' : '#9AA1AA', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>MÓDULO</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '11px', color: isDark ? '#E6B23E' : '#9AA1AA', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>QUANDO</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '11px', color: isDark ? '#E6B23E' : '#9AA1AA', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>INSTRUTOR</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '11px', color: isDark ? '#E6B23E' : '#9AA1AA', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {treinamentos.map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
                    <td style={{ padding: '16px 0', color: theme.textPrimary }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 92, 240, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.purple, fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                          {t.sigla}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{t.revenda}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: theme.textPrimary, fontSize: '14px' }}>
                      {t.modulo}
                    </td>
                    <td style={{ padding: '16px 20px', color: theme.textSecondary, fontSize: '14px' }}>
                      {t.quando}
                    </td>
                    <td style={{ padding: '16px 20px', color: theme.textPrimary, fontSize: '14px' }}>
                      {t.instrutor}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: getStatusColor(t.status),
                        background: t.status === 'Confirmado' ? (isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(124, 92, 240, 0.1)') : (isDark ? 'rgba(230, 178, 62, 0.15)' : 'rgba(230, 178, 62, 0.1)'),
                      }}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
