'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';
import { useState, useEffect } from 'react';
import { useSupabaseTable } from '@/lib/supabase/hooks';
import '@/app/globals.css';

interface Implantacao {
  id?: string;
  revenda?: string;
  etapa: string;
  progresso: number;
  status: 'em-andamento' | 'concluida' | 'pausado' | 'abandonado';
  created_at?: string;
}

const needsActionItems = [
  { revenda: 'Papelaria Central', issue: '3 tentativas de contato sem retorno', action: 'Ligar', actionColor: '#4A90E2' },
  { revenda: 'Casa do Pintor', issue: 'Parada há 9 dias em Sem retorno', action: 'Escalar', actionColor: '#E2944A' },
  { revenda: 'Auto Peças Bandeirantes', issue: 'Treinamento pediu reagendamento', action: 'Reagendar', actionColor: '#7C5CF0' },
  { revenda: 'Ferragem Sul', issue: 'Cadastro fiscal incompleto', action: 'Cobrar dados', actionColor: '#D9534F' },
];

const getColors = () => ({
  yellow: 'var(--yellow-d)',
  orange: '#C99526',
  red: 'var(--red)',
  purple: 'var(--purple)',
  green: '#4E8E5B',
  darkBg: 'var(--bg-a)',
  cardBg: 'var(--panel)',
  borderColor: 'var(--line)',
  textPrimary: 'var(--ink)',
  textSecondary: 'var(--ink-2)',
  textTertiary: 'var(--ink-3)',
});

export default function DashboardPage() {
  // @ts-ignore
  const { data: implantacoes = [] } = useSupabaseTable<Implantacao>('implantacoes');
  const [today] = useState(() => new Date().toLocaleDateString('pt-BR'));
  const [metaMes, setMetaMes] = useState(10);

  useEffect(() => {
    const saved = localStorage.getItem('meta-implantacoes-mes');
    if (saved) {
      setMetaMes(parseInt(saved));
    }
  }, []);

  const COLORS = getColors();

  const STAGES_FUNIL = [
    { id: 'chegada', nome: 'Chegada', color: COLORS.yellow },
    { id: 'boas-vindas', nome: 'Boas-vindas', color: COLORS.orange },
    { id: 'sem-retorno', nome: 'Sem retorno', color: COLORS.red },
    { id: 'ativou-3', nome: 'Ativou 3 clientes', color: COLORS.purple },
  ];

  const ativas = implantacoes.filter(i => i.status === 'em-andamento').length;
  const emRisco = implantacoes.filter(i => i.status === 'em-andamento' && i.etapa === 'sem-retorno').length;
  const concluidas = implantacoes.filter(i => i.status === 'concluida').length;

  const getCurrentMonthImplantacoes = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return implantacoes.filter(i => {
      if (!i.created_at) return false;
      const date = new Date(i.created_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
  };

  const implantacoesDoMes = getCurrentMonthImplantacoes();
  const progressoMeta = Math.min((implantacoesDoMes / metaMes) * 100, 100);
  const atingiuMeta = implantacoesDoMes >= metaMes;

  const tempoMedio = 5;

  const getFunnelData = () => {
    return STAGES_FUNIL.map(stage => {
      const count = implantacoes.filter(i => i.etapa === stage.id && i.status === 'em-andamento').length;
      const dias = stage.id === 'chegada' ? 2 : stage.id === 'boas-vindas' ? 4 : stage.id === 'sem-retorno' ? 9 : 1;
      return { ...stage, count, dias };
    });
  };

  const funnelData = getFunnelData();
  const maxCount = Math.max(...funnelData.map(s => s.count), 1);

  return (
    <PlatformLayout currentPage="dashboard">
      <div style={{ padding: '32px', paddingTop: '0' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${COLORS.borderColor}` }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.textPrimary, margin: '0 0 4px 0' }}>
                Relatório Operacional
              </h1>
              <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: 0 }}>
                Saúde da carteira de implantação no fechamento do período.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '0 0 4px 0' }}>{today}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>Carteira de revendas · {ativas} em implantação</p>
            </div>
          </div>

          {/* Vision Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '20px' }}>
              <p style={{ fontSize: '12px', color: COLORS.textTertiary, margin: '0 0 8px 0' }}>Revendas em implantação</p>
              <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary }}>{ativas}</div>
              <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '8px 0 0 0' }}>entraram esta semana</p>
            </div>

            <div style={{ background: 'rgba(230, 178, 62, 0.1)', border: `1px solid ${COLORS.yellow}`, borderRadius: '18px', padding: '20px' }}>
              <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Em risco</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.yellow }}>{emRisco}</div>
                <span style={{ fontSize: '11px', background: COLORS.yellow, color: COLORS.darkBg, padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>atenção</span>
              </div>
              <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '8px 0 0 0' }}>paradas há 5+ dias</p>
            </div>

            <div style={{ background: 'rgba(123, 92, 240, 0.08)', border: `1px solid #5B43C0`, borderRadius: '18px', padding: '20px' }}>
              <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Ciclo médio</p>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#8B7CF6' }}>18d</div>
              <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '8px 0 0 0' }}>meta: 15 dias</p>
            </div>

            <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '20px' }}>
              <p style={{ fontSize: '12px', color: COLORS.textTertiary, margin: '0 0 8px 0' }}>Go-live no mês</p>
              <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary }}>{concluidas}</div>
              <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '8px 0 0 0' }}>taxa de conclusão</p>
            </div>

            <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: COLORS.textTertiary, margin: 0, fontWeight: 500 }}>Meta do mês</p>
                <span style={{ fontSize: '11px', background: atingiuMeta ? COLORS.green : COLORS.yellow, color: atingiuMeta ? '#fff' : COLORS.darkBg, padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>{Math.round(progressoMeta)}%</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '12px' }}>
                {implantacoesDoMes}/{metaMes}
              </div>
              <div style={{ height: '8px', background: COLORS.borderColor, borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: atingiuMeta ? COLORS.green : COLORS.yellow, width: `${progressoMeta}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Funnel */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 20px 0' }}>Funil de onboarding</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {funnelData.map(stage => (
                <div key={stage.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: stage.color }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary }}>{stage.nome}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary }}>{stage.count}</span>
                      <span style={{ fontSize: '12px', color: COLORS.textTertiary }}>{stage.dias}d na etapa</span>
                    </div>
                  </div>
                  <div style={{ height: '8px', background: COLORS.borderColor, borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: stage.color, width: `${(stage.count / maxCount) * 100}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Action */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 20px 0' }}>Precisa de ação</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {needsActionItems.map((item, i) => (
                <div key={i} style={{ paddingBottom: '16px', borderBottom: i < needsActionItems.length - 1 ? `1px solid ${COLORS.borderColor}` : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 4px 0' }}>
                        {item.revenda}
                      </h4>
                      <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: 0 }}>
                        {item.issue}
                      </p>
                    </div>
                    <button style={{
                      background: 'transparent',
                      border: 'none',
                      color: item.actionColor,
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      padding: '0',
                    }}>
                      {item.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
