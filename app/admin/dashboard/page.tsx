'use client';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = {
  purple: '#8B5CF6',
  yellow: '#FFC93C',
  green: '#34D399',
  red: '#F87171',
  lightPurple: '#C4B5FD',
  darkBg: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
  textTertiary: '#6B7280',
};

export default function AdminDashboardPage() {
  // KPI Data
  const kpis = [
    {
      label: 'Revendas em implantação',
      value: '4',
      icon: '◉',
      accent: COLORS.purple,
      iconBg: 'rgba(139,92,246,0.14)',
      deltaTag: '+2',
      hint: 'esta semana',
    },
    {
      label: 'Implantações concluídas',
      value: '2',
      icon: '✓',
      accent: COLORS.green,
      iconBg: 'rgba(52,211,153,0.13)',
      deltaTag: 'Este mês',
      hint: 'meta 5',
    },
    {
      label: 'Treinamentos hoje',
      value: '0',
      icon: '▷',
      accent: COLORS.yellow,
      iconBg: 'rgba(255,201,60,0.14)',
      deltaTag: '3',
      hint: 'programados na semana',
    },
    {
      label: 'Pendências abertas',
      value: '6',
      icon: '!',
      accent: COLORS.red,
      iconBg: 'rgba(248,113,113,0.14)',
      deltaTag: '2 críticas',
      hint: 'requerem ação',
    },
  ];

  const secondary = [
    {
      label: 'Revendas atrasadas',
      value: '1',
      unit: 'de 13',
      icon: '▲',
      accent: COLORS.red,
      iconBg: 'rgba(248,113,113,0.13)',
      pct: '8%',
    },
    {
      label: 'Tempo médio de implantação',
      value: '17',
      unit: 'dias',
      icon: '◷',
      accent: COLORS.yellow,
      iconBg: 'rgba(255,201,60,0.14)',
      pct: '57%',
    },
    {
      label: 'Taxa de conclusão',
      value: '20%',
      unit: '',
      icon: '◎',
      accent: COLORS.purple,
      iconBg: 'rgba(139,92,246,0.14)',
      pct: '20%',
    },
  ];

  const bars = [
    { m: 'Mar', a: 8, b: 3 },
    { m: 'Abr', a: 5, b: 4 },
    { m: 'Mai', a: 6, b: 5 },
    { m: 'Jun', a: 4, b: 4 },
    { m: 'Jul', a: 7, b: 5 },
    { m: 'Ago', a: 5, b: 2 },
  ];

  const implementacoesChart = bars.map((d) => ({
    month: d.m,
    Iniciadas: d.a,
    Concluídas: d.b,
  }));

  const statuses = [
    { label: 'Em implantação', n: 4, color: COLORS.purple, v: 4 },
    { label: 'Em treinamento', n: 4, color: COLORS.yellow, v: 4 },
    { label: 'Concluída', n: 2, color: COLORS.green, v: 2 },
    { label: 'Aguardando revenda', n: 2, color: COLORS.lightPurple, v: 2 },
    { label: 'Atrasada', n: 1, color: COLORS.red, v: 1 },
  ];
  const total = statuses.reduce((s, x) => s + x.v, 0);
  let acc = 0;
  const donutStops = statuses
    .map((s) => {
      const from = (acc / total) * 100;
      const to = ((acc += s.v) / total) * 100;
      return `${s.color} ${from}% ${to}%`;
    })
    .join(', ');

  const rows = [
    {
      ini: 'NR',
      name: 'Nova Rota Sistemas',
      agent: 'Ana Prado',
      stage: 'Migração',
      pct: '78%',
      color: COLORS.purple,
      due: '12 dias',
    },
    {
      ini: 'TC',
      name: 'TecCampo Distribuidora',
      agent: 'Bruno Lima',
      stage: 'Treinamento',
      pct: '54%',
      color: COLORS.yellow,
      due: '20 dias',
    },
    {
      ini: 'VP',
      name: 'Vale Prime Comércio',
      agent: 'Carla Dias',
      stage: 'Configuração',
      pct: '31%',
      color: COLORS.purple,
      due: '28 dias',
    },
    {
      ini: 'MG',
      name: 'MGX Automação',
      agent: 'Diego Souza',
      stage: 'Go-live',
      pct: '92%',
      color: COLORS.green,
      due: '4 dias',
    },
    {
      ini: 'LT',
      name: 'Litoral Tech',
      agent: 'Elisa Rocha',
      stage: 'Kickoff',
      pct: '12%',
      color: COLORS.red,
      due: 'atrasada',
    },
  ];

  const pend = [
    {
      title: 'MGX Automação — dados fiscais pendentes',
      meta: 'Aberta há 9 dias · Diego Souza',
    },
    {
      title: 'Litoral Tech — acesso ao servidor',
      meta: 'Aberta há 5 dias · Elisa Rocha',
    },
  ];

  const trainings = [
    {
      day: '12',
      mon: 'Ago',
      title: 'Módulo Financeiro — Nova Rota',
      meta: '14:00 · remoto · 6 participantes',
    },
    {
      day: '14',
      mon: 'Ago',
      title: 'Fiscal avançado — TecCampo',
      meta: '09:30 · presencial · 4 participantes',
    },
    {
      day: '18',
      mon: 'Ago',
      title: 'Go-live assistido — MGX',
      meta: '08:00 · remoto · 9 participantes',
    },
  ];

  return (
    <div style={{ background: COLORS.darkBg, color: COLORS.textPrimary, fontFamily: '"DM Sans", system-ui, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&display=swap');
        .sora { font-family: "Sora", sans-serif; }
      `}</style>

      {/* Sidebar */}
      <div style={{ position: 'fixed', left: 0, top: 0, width: '268px', height: '100vh', background: COLORS.cardBg, borderRight: `1px solid ${COLORS.borderColor}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '26px 22px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                background: 'linear-gradient(150deg, #8B5CF6, #6D28D9)',
                display: 'grid',
                placeItems: 'center',
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                color: '#fff',
                fontSize: '18px',
              }}
            >
              D
            </div>
            <div>
              <div className="sora" style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Decola
              </div>
              <div style={{ fontSize: '11.5px', color: '#8A9099', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '3px' }}>
                Central de Implantação
              </div>
            </div>
          </div>
          <button style={{ background: 'transparent', border: 0, color: '#6B7280', fontSize: '18px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>
            ✕
          </button>
        </div>

        <div style={{ padding: '6px 18px 18px', display: 'flex', gap: '8px' }}>
          <div
            style={{
              flex: 1,
              padding: '9px 10px',
              borderRadius: '9px',
              background: COLORS.purple,
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              textAlign: 'center',
              letterSpacing: '0.01em',
            }}
          >
            Admin
          </div>
          <div
            style={{
              flex: 1,
              padding: '9px 10px',
              borderRadius: '9px',
              background: '#1E2127',
              color: '#9AA1AA',
              fontSize: '13px',
              fontWeight: 500,
              textAlign: 'center',
              border: '1px solid #262A31',
            }}
          >
            Agente
          </div>
        </div>

        <div style={{ height: '1px', background: COLORS.borderColor, margin: '0 18px 14px' }} />

        <nav style={{ flex: 1, overflowY: 'auto', padding: '0 14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, rgba(139,92,246,0.22), rgba(139,92,246,0.06))',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14.5px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: '9px',
                bottom: '9px',
                width: '3px',
                borderRadius: '3px',
                background: COLORS.yellow,
              }}
            />
            <span style={{ width: '18px', textAlign: 'center', color: COLORS.yellow }}>◧</span>
            Dashboard
          </div>
          {[
            { label: 'Revendas', icon: '▤' },
            { label: 'Implantações', icon: '◇' },
            { label: 'Treinamentos', icon: '▷' },
            { label: 'Agenda', icon: '▢' },
            { label: 'Agentes', icon: '◉' },
            { label: 'Pendências', icon: '!' },
            { label: 'Relatórios', icon: '≡' },
            { label: 'Configurações', icon: '⚙' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '10px',
                color: '#9AA1AA',
                fontSize: '14.5px',
                cursor: 'pointer',
              }}
            >
              <span style={{ width: '18px', textAlign: 'center', color: '#6B7280' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 22px 20px', borderTop: `1px solid ${COLORS.borderColor}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: COLORS.yellow,
              color: COLORS.cardBg,
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
              fontSize: '13px',
            }}
          >
            A
          </div>
          <div>
            <div style={{ fontSize: '13px', color: COLORS.textPrimary, fontWeight: 500 }}>Logado como</div>
            <div style={{ fontSize: '12px', color: '#8A9099' }}>Admin</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ marginLeft: '268px' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '22px 34px', background: 'rgba(14,16,19,0.92)', borderBottom: `1px solid #1D2026`, position: 'sticky', top: 0, backdropFilter: 'blur(8px)', zIndex: 5 }}>
          <div>
            <div className="sora" style={{ fontSize: '25px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              Dashboard
            </div>
            <div style={{ fontSize: '13.5px', color: '#8A9099', marginTop: '3px' }}>
              Visão geral das implantações · atualizado há 4 min
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '10px', padding: '3px' }}>
              <div style={{ padding: '6px 13px', borderRadius: '7px', fontSize: '13px', color: COLORS.cardBg, background: COLORS.yellow, fontWeight: 700 }}>
                Mês
              </div>
              <div style={{ padding: '6px 13px', borderRadius: '7px', fontSize: '13px', color: '#9AA1AA', cursor: 'pointer' }}>
                Trimestre
              </div>
              <div style={{ padding: '6px 13px', borderRadius: '7px', fontSize: '13px', color: '#9AA1AA', cursor: 'pointer' }}>
                Ano
              </div>
            </div>
            <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '10px', background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, display: 'grid', placeItems: 'center', color: '#C9CED6', cursor: 'pointer' }}>
              <span style={{ fontSize: '15px' }}>✦</span>
              <div style={{ position: 'absolute', top: '8px', right: '9px', width: '7px', height: '7px', borderRadius: '50%', background: COLORS.yellow, border: `2px solid ${COLORS.cardBg}` }} />
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, display: 'grid', placeItems: 'center', color: '#C9CED6', cursor: 'pointer', fontSize: '15px' }}>
              ⚙
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(150deg, #8B5CF6, #6D28D9)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: '15px' }}>
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '26px 34px 44px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* KPI Cards Section */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {kpis.map((k, i) => (
              <div
                key={i}
                style={{
                  background: COLORS.cardBg,
                  border: `1px solid ${COLORS.borderColor}`,
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: k.accent,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ fontSize: '13.5px', color: COLORS.textSecondary, fontWeight: 500, letterSpacing: '0.01em', maxWidth: '150px', lineHeight: '1.35' }}>
                    {k.label}
                  </div>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '15px',
                      background: k.iconBg,
                      color: k.accent,
                    }}
                  >
                    {k.icon}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <div
                    className="sora"
                    style={{
                      fontSize: '38px',
                      fontWeight: 700,
                      color: COLORS.textPrimary,
                      lineHeight: '1',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {k.value}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: COLORS.textSecondary }}>
                  <span
                    style={{
                      padding: '2px 7px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '11.5px',
                      background: k.iconBg,
                      color: k.accent,
                    }}
                  >
                    {k.deltaTag}
                  </span>
                  {k.hint}
                </div>
              </div>
            ))}
          </section>

          {/* Secondary KPIs Section */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {secondary.map((s, i) => (
              <div
                key={i}
                style={{
                  background: COLORS.cardBg,
                  border: `1px solid ${COLORS.borderColor}`,
                  borderRadius: '16px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '18px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: s.accent }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', color: COLORS.textSecondary, fontWeight: 500 }}>{s.label}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px', marginTop: '8px' }}>
                    <div
                      className="sora"
                      style={{
                        fontSize: '30px',
                        fontWeight: 700,
                        color: COLORS.textPrimary,
                        lineHeight: '1',
                        letterSpacing: '-0.03em',
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: '13.5px', color: COLORS.textTertiary }}>{s.unit}</div>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      borderRadius: '6px',
                      background: COLORS.borderColor,
                      marginTop: '14px',
                      overflow: 'hidden',
                      width: '190px',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '6px',
                        width: s.pct,
                        background: s.accent,
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '17px',
                    background: s.iconBg,
                    color: s.accent,
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
              </div>
            ))}
          </section>

          {/* Charts Section */}
          <section style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '16px' }}>
            {/* Bar Chart */}
            <div
              style={{
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.borderColor}`,
                borderRadius: '18px',
                padding: '24px 26px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '22px',
              }}
            >
              <div>
                <div className="sora" style={{ fontSize: '17px', fontWeight: 600, color: COLORS.textPrimary }}>
                  Implantações iniciadas x concluídas
                </div>
                <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginTop: '4px' }}>Últimos 6 meses</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={implementacoesChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderColor} />
                  <XAxis dataKey="month" stroke={COLORS.textSecondary} />
                  <YAxis stroke={COLORS.textSecondary} />
                  <Tooltip contentStyle={{ backgroundColor: '#1A1D23', border: 'none', color: COLORS.textPrimary }} />
                  <Legend />
                  <Bar dataKey="Iniciadas" fill={COLORS.purple} />
                  <Bar dataKey="Concluídas" fill={COLORS.yellow} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div
              style={{
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.borderColor}`,
                borderRadius: '18px',
                padding: '24px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div>
                <div className="sora" style={{ fontSize: '17px', fontWeight: 600, color: COLORS.textPrimary }}>
                  Revendas por status
                </div>
                <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginTop: '4px' }}>13 revendas no total</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0 8px' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '186px',
                    height: '186px',
                    borderRadius: '50%',
                    background: `conic-gradient(${donutStops})`,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: '26px',
                      borderRadius: '50%',
                      background: COLORS.cardBg,
                      display: 'grid',
                      placeItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      <div className="sora" style={{ fontSize: '30px', fontWeight: 700, color: COLORS.textPrimary, lineHeight: '1' }}>
                        13
                      </div>
                      <div
                        style={{
                          fontSize: '11.5px',
                          color: COLORS.textSecondary,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          marginTop: '5px',
                        }}
                      >
                        revendas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {statuses.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '11px',
                      padding: '8px 4px',
                      borderTop: `1px solid #1F2228`,
                    }}
                  >
                    <span
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '3px',
                        background: s.color,
                      }}
                    />
                    <div style={{ flex: 1, fontSize: '13.5px', color: COLORS.textPrimary }}>{s.label}</div>
                    <div style={{ fontSize: '13.5px', color: COLORS.textPrimary, fontWeight: 600 }}>{s.n}</div>
                    <div style={{ fontSize: '12.5px', color: COLORS.textTertiary, width: '42px', textAlign: 'right' }}>
                      {Math.round((s.v / total) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom Section - Table and Pending */}
          <section style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '16px' }}>
            {/* Table */}
            <div
              style={{
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.borderColor}`,
                borderRadius: '18px',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '22px 26px 16px' }}>
                <div className="sora" style={{ fontSize: '17px', fontWeight: 600, color: COLORS.textPrimary }}>
                  Implantações em andamento
                </div>
                <div style={{ fontSize: '13px', color: COLORS.yellow, fontWeight: 600, cursor: 'pointer' }}>Ver todas →</div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.6fr 1fr 1.2fr 84px',
                  gap: '14px',
                  padding: '10px 26px',
                  fontSize: '11.5px',
                  color: COLORS.textTertiary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  borderBottom: `1px solid ${COLORS.borderColor}`,
                }}
              >
                <div>Revenda</div>
                <div>Etapa</div>
                <div>Progresso</div>
                <div style={{ textAlign: 'right' }}>Prazo</div>
              </div>
              {rows.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.6fr 1fr 1.2fr 84px',
                    gap: '14px',
                    alignItems: 'center',
                    padding: '15px 26px',
                    borderBottom: `1px solid #1C1F25`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '9px',
                        background: COLORS.borderColor,
                        color: COLORS.lightPurple,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {r.ini}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14px', color: COLORS.textPrimary, fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: '12px', color: COLORS.textTertiary }}>{r.agent}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>{r.stage}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '6px',
                        borderRadius: '6px',
                        background: COLORS.borderColor,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          borderRadius: '6px',
                          width: r.pct,
                          background: r.color,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary, width: '32px' }}>{r.pct}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12.5px', fontWeight: 600, color: r.color }}>{r.due}</div>
                </div>
              ))}
            </div>

            {/* Right Column - Pending and Trainings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Critical Pending */}
              <div
                style={{
                  background: 'linear-gradient(150deg, #6D28D9, #4C1D95)',
                  borderRadius: '18px',
                  padding: '22px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="sora" style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                    Pendências críticas
                  </div>
                  <div
                    style={{
                      background: COLORS.yellow,
                      color: COLORS.cardBg,
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '7px',
                    }}
                  >
                    {pend.length}
                  </div>
                </div>
                {pend.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.09)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '12px',
                      padding: '13px 14px',
                    }}
                  >
                    <div style={{ fontSize: '13.5px', color: COLORS.textPrimary, fontWeight: 600 }}>{p.title}</div>
                    <div style={{ fontSize: '12.5px', color: '#DDD6FE', marginTop: '4px' }}>{p.meta}</div>
                  </div>
                ))}
                <div
                  style={{
                    background: COLORS.yellow,
                    color: COLORS.cardBg,
                    textAlign: 'center',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    padding: '11px',
                    borderRadius: '11px',
                    cursor: 'pointer',
                  }}
                >
                  Resolver pendências
                </div>
              </div>

              {/* Upcoming Trainings */}
              <div
                style={{
                  background: COLORS.cardBg,
                  border: `1px solid ${COLORS.borderColor}`,
                  borderRadius: '18px',
                  padding: '22px 24px',
                  flex: 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                  <div className="sora" style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                    Próximos treinamentos
                  </div>
                  <div style={{ fontSize: '12.5px', color: COLORS.textSecondary }}>Nenhum hoje</div>
                </div>
                {trainings.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '13px',
                      padding: '13px 0',
                      borderTop: `1px solid #1F2228`,
                    }}
                  >
                    <div style={{ width: '44px', textAlign: 'center', flexShrink: 0 }}>
                      <div className="sora" style={{ fontSize: '17px', fontWeight: 700, color: COLORS.yellow, lineHeight: '1' }}>
                        {t.day}
                      </div>
                      <div style={{ fontSize: '10.5px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
                        {t.mon}
                      </div>
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
          </section>
        </div>
      </main>
    </div>
  );
}
