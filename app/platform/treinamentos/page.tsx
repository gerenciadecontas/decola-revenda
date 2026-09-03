'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';
import '@/app/globals.css';

const COLORS = {
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
  textTertiary: '#6B7280',
  purple: '#8B5CF6',
  yellow: '#FFC93C',
  blue: '#4A90E2',
};

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

const getStatusColor = (status: string) => {
  if (status === 'Confirmado') return COLORS.purple;
  if (status === 'A confirmar') return COLORS.yellow;
  if (status === 'Reagendar') return COLORS.yellow;
  return COLORS.textSecondary;
};

const getStatusBg = (status: string) => {
  if (status === 'Confirmado') return `${COLORS.purple}22`;
  if (status === 'A confirmar') return `${COLORS.yellow}22`;
  if (status === 'Reagendar') return `${COLORS.yellow}22`;
  return `${COLORS.textSecondary}22`;
};

export default function TreinamentosPage() {
  return (
    <PlatformLayout currentPage="treinamentos">
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.textPrimary, margin: '0 0 8px 0' }}>
            Treinamentos
          </h1>
          <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: 0 }}>
            24 sessões no trimestre · 5 agendadas para a semana.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textTertiary, margin: '0 0 8px 0' }}>Treinamentos</p>
            <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '4px' }}>24</div>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: 0 }}>no trimestre</p>
          </div>

          <div style={{ background: 'rgba(240, 184, 60, 0.08)', border: `1px solid ${COLORS.yellow}`, borderRadius: '18px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Concluídos</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.yellow }}>16</div>
              <span style={{ fontSize: '12px', color: COLORS.textSecondary }}>67%</span>
            </div>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '8px 0 0 0' }}>da meta trimestral</p>
          </div>

          <div style={{ background: 'rgba(52, 211, 153, 0.08)', border: `1px solid #34D399`, borderRadius: '18px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Em andamento</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#34D399' }}>8</div>
              <span style={{ fontSize: '12px', color: COLORS.textSecondary }}>hoje</span>
            </div>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '8px 0 0 0' }}>com sessão marcada</p>
          </div>

          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textTertiary, margin: '0 0 8px 0' }}>Agentes treinados</p>
            <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '4px' }}>12</div>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: 0 }}>novos este mês</p>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.borderColor}`, background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>REVENDA</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>MÓDULO</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>QUANDO</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>INSTRUTOR</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {treinamentos.map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < treinamentos.length - 1 ? `1px solid ${COLORS.borderColor}` : 'none' }}>
                    <td style={{ padding: '16px 20px', color: COLORS.textPrimary, verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${COLORS.purple}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.purple, fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                          {t.sigla}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary }}>{t.revenda}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: COLORS.textPrimary, fontSize: '14px' }}>
                      {t.modulo}
                    </td>
                    <td style={{ padding: '16px 20px', color: COLORS.textSecondary, fontSize: '14px' }}>
                      {t.quando}
                    </td>
                    <td style={{ padding: '16px 20px', color: COLORS.textPrimary, fontSize: '14px' }}>
                      {t.instrutor}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: getStatusColor(t.status),
                        background: getStatusBg(t.status),
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
