'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';

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

export default function DashboardPage() {
  const kpis = [
    { label: 'Revendas em implantação', value: '4', icon: '◉', accent: COLORS.purple, deltaTag: '+2', hint: 'esta semana' },
    { label: 'Implantações concluídas', value: '2', icon: '✓', accent: COLORS.green, deltaTag: 'Este mês', hint: 'meta 5' },
    { label: 'Treinamentos hoje', value: '0', icon: '▷', accent: COLORS.yellow, deltaTag: '3', hint: 'programados na semana' },
    { label: 'Pendências abertas', value: '6', icon: '!', accent: COLORS.red, deltaTag: '2 críticas', hint: 'requerem ação' },
  ];

  const secondary = [
    { label: 'Revendas atrasadas', value: '1', unit: 'de 13', icon: '▲', accent: COLORS.red, pct: '8%' },
    { label: 'Tempo médio de implantação', value: '17', unit: 'dias', icon: '◷', accent: COLORS.yellow, pct: '57%' },
    { label: 'Taxa de conclusão', value: '20%', unit: '', icon: '◎', accent: COLORS.purple, pct: '20%' },
  ];

  return (
    <PlatformLayout currentPage="dashboard">
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

        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(150deg, #6D28D9, #4C1D95)', borderRadius: '18px', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>Pendências críticas</div>
              <div style={{ background: COLORS.yellow, color: COLORS.cardBg, fontSize: '12px', fontWeight: 700, padding: '3px 9px', borderRadius: '7px' }}>2</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '12px', padding: '13px 14px' }}>
              <div style={{ fontSize: '13.5px', color: COLORS.textPrimary, fontWeight: 600 }}>MGX Automação — dados fiscais pendentes</div>
              <div style={{ fontSize: '12.5px', color: '#DDD6FE', marginTop: '4px' }}>Aberta há 9 dias · Diego Souza</div>
            </div>
            <div style={{ background: COLORS.yellow, color: COLORS.cardBg, textAlign: 'center', fontSize: '13.5px', fontWeight: 700, padding: '11px', borderRadius: '11px', cursor: 'pointer' }}>
              Resolver pendências
            </div>
          </div>

          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '22px 24px' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '6px' }}>Próximos treinamentos</div>
            <div style={{ fontSize: '12.5px', color: COLORS.textSecondary, marginBottom: '12px' }}>Nenhum hoje</div>
            {[
              { day: '12', mon: 'Ago', title: 'Módulo Financeiro — Nova Rota', meta: '14:00 · remoto · 6 participantes' },
              { day: '14', mon: 'Ago', title: 'Fiscal avançado — TecCampo', meta: '09:30 · presencial · 4 participantes' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '13px', padding: '13px 0', borderTop: `1px solid #1F2228` }}>
                <div style={{ width: '44px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: COLORS.yellow, lineHeight: '1' }}>{t.day}</div>
                  <div style={{ fontSize: '10.5px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{t.mon}</div>
                </div>
                <div style={{ width: '1px', alignSelf: 'stretch', background: COLORS.borderColor }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', color: COLORS.textPrimary, fontWeight: 500 }}>{t.title}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '3px' }}>{t.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
