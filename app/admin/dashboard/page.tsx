'use client';

import { GestorLayout } from '@/app/components/GestorLayout';
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

export default function AdminDashboardPage() {
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);

  // Carregar pendências do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pendencias-list');
    if (saved) {
      setPendencias(JSON.parse(saved));
    }
  }, []);

  const pendenciasAbertas = pendencias.filter(p => p.status === 'aberta');
  const pendenciasCriticas = pendenciasAbertas.filter(p => p.nivel === 'critica');
  const kpis = [
    { label: 'Revendas em implantação', value: '4', icon: '◉', accent: COLORS.purple, deltaTag: '+2', hint: 'esta semana' },
    { label: 'Implantações concluídas', value: '2', icon: '✓', accent: COLORS.green, deltaTag: 'Este mês', hint: 'meta 5' },
    { label: 'Treinamentos hoje', value: '0', icon: '▷', accent: COLORS.yellow, deltaTag: '3', hint: 'programados na semana' },
    { label: 'Pendências abertas', value: pendenciasAbertas.length.toString(), icon: '!', accent: COLORS.red, deltaTag: `${pendenciasCriticas.length} críticas`, hint: 'requerem ação' },
  ];

  const secondary = [
    { label: 'Revendas atrasadas', value: '1', unit: 'de 13', icon: '▲', accent: COLORS.red, pct: '8%' },
    { label: 'Tempo médio de implantação', value: '17', unit: 'dias', icon: '◷', accent: COLORS.yellow, pct: '57%' },
    { label: 'Taxa de conclusão', value: '20%', unit: '', icon: '◎', accent: COLORS.purple, pct: '20%' },
  ];

  const rows = [
    { ini: 'NR', name: 'Nova Rota Sistemas', agent: 'Ana Prado', stage: 'Migração', pct: '78%', color: COLORS.purple, due: '12 dias' },
    { ini: 'TC', name: 'TecCampo Distribuidora', agent: 'Bruno Lima', stage: 'Treinamento', pct: '54%', color: COLORS.yellow, due: '20 dias' },
    { ini: 'VP', name: 'Vale Prime Comércio', agent: 'Carla Dias', stage: 'Configuração', pct: '31%', color: COLORS.purple, due: '28 dias' },
    { ini: 'MG', name: 'MGX Automação', agent: 'Diego Souza', stage: 'Go-live', pct: '92%', color: COLORS.green, due: '4 dias' },
  ];

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '13.5px', color: COLORS.textSecondary, fontWeight: 500 }}>{k.label}</div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', background: `${k.accent}22`, color: k.accent }}>
                {k.icon}
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 700, color: COLORS.textPrimary }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: COLORS.textSecondary }}>
              <span style={{ padding: '2px 7px', borderRadius: '6px', fontWeight: 700, fontSize: '11.5px', background: `${k.accent}22`, color: k.accent }}>{k.deltaTag}</span>
              {k.hint}
            </div>
          </div>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {secondary.map((s, i) => (
          <div key={i} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13.5px', color: COLORS.textSecondary, fontWeight: 500 }}>{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px', marginTop: '8px' }}>
                <div style={{ fontSize: '30px', fontWeight: 700, color: COLORS.textPrimary }}>{s.value}</div>
                <div style={{ fontSize: '13.5px', color: COLORS.textTertiary }}>{s.unit}</div>
              </div>
              <div style={{ height: '6px', borderRadius: '6px', background: COLORS.borderColor, marginTop: '14px', overflow: 'hidden', width: '190px' }}>
                <div style={{ height: '100%', borderRadius: '6px', width: s.pct, background: s.accent }} />
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', background: `${s.accent}22`, color: s.accent, flexShrink: 0 }}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', overflow: 'hidden' }}>
        <div style={{ padding: '22px 26px', borderBottom: `1px solid ${COLORS.borderColor}` }}>
          <h3 style={{ fontSize: '17px', fontWeight: 600, color: COLORS.textPrimary }}>Implantações em andamento</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.2fr 84px', gap: '14px', padding: '10px 26px', fontSize: '11.5px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${COLORS.borderColor}`, fontWeight: 600 }}>
          <div>Revenda</div>
          <div>Etapa</div>
          <div>Progresso</div>
          <div style={{ textAlign: 'right' }}>Prazo</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.2fr 84px', gap: '14px', alignItems: 'center', padding: '15px 26px', borderBottom: i < rows.length - 1 ? `1px solid #1C1F25` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: 0 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: COLORS.borderColor, color: '#C4B5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: 700, flexShrink: 0 }}>
                {r.ini}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '14px', color: COLORS.textPrimary, fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontSize: '12px', color: COLORS.textTertiary }}>{r.agent}</div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>{r.stage}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{ flex: 1, height: '6px', borderRadius: '6px', background: COLORS.borderColor, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '6px', width: r.pct, background: r.color }} />
              </div>
              <div style={{ fontSize: '12px', color: COLORS.textSecondary, width: '32px' }}>{r.pct}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12.5px', fontWeight: 600, color: r.color }}>{r.due}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <GestorLayout currentPage="dashboard">
      {content}
    </GestorLayout>
  );
}
