'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';
import { useState, useEffect } from 'react';

const COLORS = {
  purple: '#8B5CF6',
  yellow: '#FFC93C',
  green: '#34D399',
  red: '#F87171',
  darkBg: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
  textTertiary: '#6B7280',
};

interface Pendencia {
  id: string;
  revenda: string;
  descricao: string;
  nivel: 'critica' | 'normal';
  status: 'aberta' | 'resolvida';
  dataAbertura: string;
}

export default function DashboardPage() {
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);

  // Carregar pendências do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pendencias-list');
    if (saved) {
      setPendencias(JSON.parse(saved));
    }
  }, []);

  // Calcular dias abertos
  const getDiasAbertos = (dataAbertura: string) => {
    const hoje = new Date();
    const data = new Date(dataAbertura);
    const diff = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Pendências de hoje (carregadas do localStorage)
  const hoje = new Date().toISOString().split('T')[0];
  const pendenciasHoje = pendencias.filter(p => p.status === 'aberta' && p.dataAbertura === hoje);

  const trainingsToday = [
    { time: '10:00', title: 'LC WEB - Cadastro de Produtos', revenda: 'Auto Nova Peças' },
    { time: '14:30', title: 'LC WEB - Vendas', revenda: 'Elétrica Pro' },
  ];

  const deploymentsToday = [
    { id: 1, revenda: 'MGX Automação', stage: 'Configuração', progress: 65 },
    { id: 2, revenda: 'TecCampo', stage: 'Testes', progress: 80 },
  ];

  const upcomingTrainings = [
    { date: '12 Ago', time: '14:00', title: 'Módulo Financeiro', revenda: 'Nova Rota', remote: true },
    { date: '14 Ago', time: '09:30', title: 'Fiscal avançado', revenda: 'TecCampo', remote: false },
    { date: '16 Ago', time: '11:00', title: 'LC ERP Desktop', revenda: 'Auto Nova', remote: true },
  ];

  const myRevendas = [
    { name: 'Auto Nova Peças', city: 'São Paulo', status: 'Em implantação', lastContact: '2 dias' },
    { name: 'MGX Automação', city: 'Belo Horizonte', status: 'Ativa', lastContact: '5 dias' },
    { name: 'TecCampo', city: 'Curitiba', status: 'Em implantação', lastContact: '1 dia' },
    { name: 'Elétrica Pro', city: 'Rio de Janeiro', status: 'Ativa', lastContact: '3 dias' },
  ];

  const needsAttention = [
    { name: 'Nova Rota Distribuição', issue: 'Sem resposta há 7 dias', daysAlert: 7 },
    { name: 'Força Distribuidora', issue: 'Dúvidas não respondidas', daysAlert: 4 },
  ];

  const delayedActivities = [
    { activity: 'Treinamento de Força de Vendas', revenda: 'Auto Nova Peças', daysLate: 2 },
    { activity: 'Implementação de relatórios customizados', revenda: 'Elétrica Pro', daysLate: 5 },
  ];

  const weekAgenda = [
    { day: 'Segunda', date: '11 Ago', items: ['10:00 - Treinamento LC WEB', '15:00 - Reunião MGX'] },
    { day: 'Terça', date: '12 Ago', items: ['14:00 - Treinamento Financeiro'] },
    { day: 'Quarta', date: '13 Ago', items: ['Sem compromissos'] },
    { day: 'Quinta', date: '14 Ago', items: ['09:30 - Treinamento TecCampo', '16:00 - Acompanhamento'] },
    { day: 'Sexta', date: '15 Ago', items: ['14:00 - Reunião de Resultados'] },
  ];

  return (
    <PlatformLayout currentPage="dashboard">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Page Header */}
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
            Seu Dashboard
          </h1>
          <p style={{ fontSize: '15px', color: COLORS.textSecondary, margin: 0 }}>
            Acompanhe suas atividades, treinamentos e implantações de hoje
          </p>
        </div>

        {/* TODAY SECTION - Priority Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Trainings Today */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ fontSize: '24px' }}>📚</div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>Treinamentos Hoje</h3>
              <div style={{ background: COLORS.yellow, color: COLORS.darkBg, fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', marginLeft: 'auto' }}>
                {trainingsToday.length}
              </div>
            </div>
            {trainingsToday.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {trainingsToday.map((training, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px', borderLeft: `3px solid ${COLORS.yellow}` }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.yellow }}>{training.time}</div>
                    <div style={{ fontSize: '13px', color: COLORS.textPrimary, marginTop: '4px', fontWeight: 500 }}>{training.title}</div>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '3px' }}>{training.revenda}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>Nenhum treinamento programado para hoje</div>
            )}
          </div>

          {/* Deployments Today */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ fontSize: '24px' }}>🚀</div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>Implantações Hoje</h3>
              <div style={{ background: COLORS.green, color: COLORS.darkBg, fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', marginLeft: 'auto' }}>
                {deploymentsToday.length}
              </div>
            </div>
            {deploymentsToday.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {deploymentsToday.map((dep, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>{dep.revenda}</div>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '3px' }}>{dep.stage}</div>
                    <div style={{ height: '5px', borderRadius: '4px', background: COLORS.borderColor, marginTop: '8px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: COLORS.green, width: `${dep.progress}%` }} />
                    </div>
                    <div style={{ fontSize: '11px', color: COLORS.textTertiary, marginTop: '4px' }}>{dep.progress}% concluído</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>Nenhuma implantação prevista para hoje</div>
            )}
          </div>

          {/* Critical Pendencies */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ fontSize: '24px' }}>⚠️</div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>Pendências Críticas</h3>
              <div style={{ background: COLORS.red, color: '#fff', fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', marginLeft: 'auto' }}>
                {pendenciasHoje.filter(p => p.nivel === 'critica').length}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pendenciasHoje.filter(p => p.nivel === 'critica').length === 0 ? (
                <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Nenhuma pendência crítica no momento</div>
              ) : (
                pendenciasHoje.filter(p => p.nivel === 'critica').map((p, i) => (
                  <div key={i} style={{ background: 'rgba(248,113,113,0.08)', padding: '10px', borderRadius: '8px', borderLeft: `3px solid ${COLORS.red}` }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>{p.revenda}</div>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '3px' }}>{p.descricao}</div>
                    <div style={{ fontSize: '11px', color: COLORS.red, marginTop: '3px', fontWeight: 600 }}>⏰ Aberta há {getDiasAbertos(p.dataAbertura)} dias</div>
                  </div>
                ))
              )}
            </div>
            <button style={{ background: COLORS.red, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}>
              Ir para Pendências
            </button>
          </div>
        </div>

        {/* PENDING ACTIONS & ATTENTION */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {/* All Pendencies */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 14px 0' }}>Pendências para Resolver</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendenciasHoje.length === 0 ? (
                <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Nenhuma pendência aberta</div>
              ) : (
                pendenciasHoje.map((p, i) => (
                  <div key={i} style={{ padding: '12px', background: p.nivel === 'critica' ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.04)', borderRadius: '10px', borderLeft: `3px solid ${p.nivel === 'critica' ? COLORS.red : COLORS.yellow}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>{p.revenda}</div>
                        <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '3px' }}>{p.descricao}</div>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: p.nivel === 'critica' ? COLORS.red : COLORS.yellow, whiteSpace: 'nowrap' }}>
                        {getDiasAbertos(p.dataAbertura)}d
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Revendas that need attention */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 14px 0' }}>Revendas que Precisam de Atenção</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {needsAttention.map((item, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(255,193,60,0.08)', borderRadius: '10px', borderLeft: `3px solid ${COLORS.yellow}` }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '3px' }}>{item.issue}</div>
                  <div style={{ fontSize: '11px', color: COLORS.yellow, marginTop: '3px', fontWeight: 600 }}>⏰ {item.daysAlert} dias sem retorno</div>
                </div>
              ))}
            </div>
          </div>

          {/* Delayed Activities */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 14px 0' }}>Atividades Atrasadas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {delayedActivities.map((activity, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(248,113,113,0.08)', borderRadius: '10px', borderLeft: `3px solid ${COLORS.red}` }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>{activity.activity}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '3px' }}>{activity.revenda}</div>
                  <div style={{ fontSize: '11px', color: COLORS.red, marginTop: '3px', fontWeight: 600 }}>📅 {activity.daysLate} dias atrasado</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* UPCOMING & SCHEDULE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {/* Upcoming Trainings */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 16px 0' }}>Próximos Treinamentos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingTrainings.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                  <div style={{ textAlign: 'center', minWidth: '50px', flexShrink: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: COLORS.yellow }}>{t.date.split(' ')[0]}</div>
                    <div style={{ fontSize: '11px', color: COLORS.textTertiary, marginTop: '2px' }}>{t.date.split(' ')[1]}</div>
                  </div>
                  <div style={{ width: '1px', background: COLORS.borderColor }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>{t.title}</div>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '3px' }}>{t.revenda}</div>
                    <div style={{ fontSize: '11px', color: COLORS.textTertiary, marginTop: '4px' }}>
                      {t.time} · {t.remote ? '🌐 Remoto' : '📍 Presencial'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Revendas */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 16px 0' }}>Revendas Sob Minha Responsabilidade</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myRevendas.map((revenda, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>{revenda.name}</div>
                      <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '2px' }}>{revenda.city}</div>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', background: revenda.status === 'Em implantação' ? `${COLORS.purple}22` : `${COLORS.green}22`, color: revenda.status === 'Em implantação' ? COLORS.purple : COLORS.green }}>
                      {revenda.status}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: COLORS.textTertiary, marginTop: '6px' }}>Último contato: {revenda.lastContact}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Week Agenda */}
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 16px 0' }}>Minha Agenda da Semana</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {weekAgenda.map((day, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>{day.day}</div>
                      <div style={{ fontSize: '11px', color: COLORS.textTertiary }}>{day.date}</div>
                    </div>
                  </div>
                  {day.items.map((item, j) => (
                    <div key={j} style={{ fontSize: '12px', color: COLORS.textSecondary, paddingLeft: '12px', borderLeft: `2px solid ${COLORS.purple}`, marginTop: j > 0 ? '6px' : '0' }}>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
