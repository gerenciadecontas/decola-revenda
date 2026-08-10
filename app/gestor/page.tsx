import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth';

export default async function GestorDashboardPage() {
  const profile = await getUserProfile();

  if (!profile || profile.role !== 'gestor') {
    redirect('/login');
  }

  const navItems = [
    { label: 'Revendas', icon: '▤' },
    { label: 'Implantações', icon: '◇' },
    { label: 'Treinamentos', icon: '▷' },
    { label: 'Agenda', icon: '▢' },
    { label: 'Agentes', icon: '◉' },
    { label: 'Pendências', icon: '!' },
    { label: 'Relatórios', icon: '≡' },
    { label: 'Configurações', icon: '⚙' }
  ];

  const kpis = [
    {
      label: 'Revendas em implantação',
      value: '4',
      unit: '',
      icon: '◉',
      accent: '#8B5CF6',
      iconBg: 'rgba(139,92,246,0.14)',
      deltaTag: '+2',
      hint: 'esta semana'
    },
    {
      label: 'Implantações concluídas',
      value: '2',
      unit: '',
      icon: '✓',
      accent: '#34D399',
      iconBg: 'rgba(52,211,153,0.13)',
      deltaTag: 'Este mês',
      hint: 'meta 5'
    },
    {
      label: 'Treinamentos hoje',
      value: '0',
      unit: '',
      icon: '▷',
      accent: '#FFC93C',
      iconBg: 'rgba(255,201,60,0.14)',
      deltaTag: '3',
      hint: 'programados na semana'
    },
    {
      label: 'Pendências abertas',
      value: '6',
      unit: '',
      icon: '!',
      accent: '#F87171',
      iconBg: 'rgba(248,113,113,0.14)',
      deltaTag: '2 críticas',
      hint: 'requerem ação'
    }
  ];

  const secondary = [
    {
      label: 'Revendas atrasadas',
      value: '1',
      unit: 'de 13',
      icon: '▲',
      accent: '#F87171',
      iconBg: 'rgba(248,113,113,0.13)',
      pct: '8%'
    },
    {
      label: 'Tempo médio de implantação',
      value: '17',
      unit: 'dias',
      icon: '◷',
      accent: '#FFC93C',
      iconBg: 'rgba(255,201,60,0.14)',
      pct: '57%'
    },
    {
      label: 'Taxa de conclusão',
      value: '20%',
      unit: '',
      icon: '◎',
      accent: '#8B5CF6',
      iconBg: 'rgba(139,92,246,0.14)',
      pct: '20%'
    }
  ];

  const bars = [
    { m: 'Mar', a: 8, b: 3 },
    { m: 'Abr', a: 5, b: 4 },
    { m: 'Mai', a: 6, b: 5 },
    { m: 'Jun', a: 4, b: 4 },
    { m: 'Jul', a: 7, b: 5 },
    { m: 'Ago', a: 5, b: 2 }
  ];

  const statuses = [
    { label: 'Em implantação', n: 4, color: '#8B5CF6', v: 4 },
    { label: 'Em treinamento', n: 4, color: '#FFC93C', v: 4 },
    { label: 'Concluída', n: 2, color: '#34D399', v: 2 },
    { label: 'Aguardando revenda', n: 2, color: '#C4B5FD', v: 2 },
    { label: 'Atrasada', n: 1, color: '#F87171', v: 1 }
  ];

  const total = statuses.reduce((s, x) => s + x.v, 0);
  let acc = 0;
  const gradientStops = statuses
    .map(s => {
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
      color: '#8B5CF6',
      due: '12 dias'
    },
    {
      ini: 'TC',
      name: 'TecCampo Distribuidora',
      agent: 'Bruno Lima',
      stage: 'Treinamento',
      pct: '54%',
      color: '#FFC93C',
      due: '20 dias'
    },
    {
      ini: 'VP',
      name: 'Vale Prime Comércio',
      agent: 'Carla Dias',
      stage: 'Configuração',
      pct: '31%',
      color: '#8B5CF6',
      due: '28 dias'
    },
    {
      ini: 'MG',
      name: 'MGX Automação',
      agent: 'Diego Souza',
      stage: 'Go-live',
      pct: '92%',
      color: '#34D399',
      due: '4 dias'
    },
    {
      ini: 'LT',
      name: 'Litoral Tech',
      agent: 'Elisa Rocha',
      stage: 'Kickoff',
      pct: '12%',
      color: '#F87171',
      due: 'atrasada'
    }
  ];

  const pend = [
    { title: 'MGX Automação — dados fiscais pendentes', meta: 'Aberta há 9 dias · Diego Souza' },
    { title: 'Litoral Tech — acesso ao servidor', meta: 'Aberta há 5 dias · Elisa Rocha' }
  ];

  const trainings = [
    {
      day: '12',
      mon: 'Ago',
      title: 'Módulo Financeiro — Nova Rota',
      meta: '14:00 · remoto · 6 participantes'
    },
    {
      day: '14',
      mon: 'Ago',
      title: 'Fiscal avançado — TecCampo',
      meta: '09:30 · presencial · 4 participantes'
    },
    {
      day: '18',
      mon: 'Ago',
      title: 'Go-live assistido — MGX',
      meta: '08:00 · remoto · 9 participantes'
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#0E1013] text-[#E8EAED]">
      {/* Sidebar */}
      <aside className="w-[268px] bg-[#16181D] border-r border-[#23262C] flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-[22px] pt-[26px] pb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center font-bold text-white text-lg">
              D
            </div>
            <div>
              <div className="font-bold text-white text-xl leading-tight">Decola</div>
              <div className="text-[11.5px] text-[#8A9099] uppercase tracking-wide mt-1">
                Central de Implantação
              </div>
            </div>
          </div>
          <button className="bg-transparent border-0 text-[#6B7280] text-lg cursor-pointer p-1">
            ✕
          </button>
        </div>

        {/* Role Tabs */}
        <div className="px-[18px] pb-[18px] flex gap-2">
          <div className="flex-1 py-[9px] px-[10px] rounded-[9px] bg-[#8B5CF6] text-white text-xs font-bold text-center">
            Gestor
          </div>
          <div className="flex-1 py-[9px] px-[10px] rounded-[9px] bg-[#1E2127] text-[#9AA1AA] text-xs font-medium text-center border border-[#262A31] hover:text-white hover:border-[#33383F]">
            Agente
          </div>
        </div>

        <div className="h-px bg-[#23262C] mx-[18px] mb-[14px]"></div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-[14px] flex flex-col gap-1">
          <div className="flex items-center gap-3 px-[14px] py-[11px] rounded-[10px] bg-gradient-to-r from-[rgba(139,92,246,0.22)] to-[rgba(139,92,246,0.06)] text-white font-semibold text-sm relative">
            <div className="absolute left-0 top-[9px] bottom-[9px] w-1 rounded-r bg-[#FFC93C]"></div>
            <span className="w-[18px] text-center text-[#FFC93C]">◧</span>
            Dashboard
          </div>
          {navItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-[14px] py-[11px] rounded-[10px] text-[#9AA1AA] text-sm cursor-pointer hover:bg-[#1E2127] hover:text-white"
            >
              <span className="w-[18px] text-center text-[#6B7280]">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="px-[22px] py-5 border-t border-[#23262C] flex items-center gap-[10px]">
          <div className="w-[30px] h-[30px] rounded-full bg-[#FFC93C] text-[#16181D] flex items-center justify-center font-bold text-xs">
            G
          </div>
          <div>
            <div className="text-xs text-[#E8EAED] font-medium">Logado como</div>
            <div className="text-[12px] text-[#8A9099]">Gestor</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-5 flex items-center justify-between gap-6 px-[34px] py-[22px] bg-[rgba(14,16,19,0.92)] border-b border-[#1D2026] backdrop-blur-lg">
          <div>
            <div className="text-[25px] font-bold text-white">Dashboard</div>
            <div className="text-xs text-[#8A9099] mt-1">
              Visão geral das implantações · atualizado há 4 min
            </div>
          </div>
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[2px] bg-[#16181D] border border-[#23262C] rounded-[10px] p-1">
              <div className="px-[13px] py-[6px] rounded-[7px] text-xs text-[#16181D] bg-[#FFC93C] font-bold">
                Mês
              </div>
              <div className="px-[13px] py-[6px] rounded-[7px] text-xs text-[#9AA1AA] cursor-pointer hover:text-white">
                Trimestre
              </div>
              <div className="px-[13px] py-[6px] rounded-[7px] text-xs text-[#9AA1AA] cursor-pointer hover:text-white">
                Ano
              </div>
            </div>
            <div className="relative w-[38px] h-[38px] rounded-[10px] bg-[#16181D] border border-[#23262C] flex items-center justify-center text-[#C9CED6] cursor-pointer hover:border-[#33383F]">
              <span className="text-sm">✦</span>
              <div className="absolute top-2 right-[9px] w-[7px] h-[7px] rounded-full bg-[#FFC93C] border-2 border-[#16181D]"></div>
            </div>
            <div className="w-[38px] h-[38px] rounded-[10px] bg-[#16181D] border border-[#23262C] flex items-center justify-center text-[#C9CED6] cursor-pointer hover:border-[#33383F] text-sm">
              ⚙
            </div>
            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-[34px] py-[26px] pb-[44px] flex flex-col gap-[22px]">
          {/* KPIs */}
          <section className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => (
              <div
                key={i}
                className="bg-[#16181D] border border-[#23262C] rounded-2xl p-5 flex flex-col gap-[14px] relative overflow-hidden hover:border-[#33383F]"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-[var(--accent)]" style={{ '--accent': k.accent } as any}></div>
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs text-[#9AA1AA] font-medium tracking-wide max-w-[150px] leading-snug">
                    {k.label}
                  </div>
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: k.iconBg, color: k.accent }}
                  >
                    {k.icon}
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="font-bold text-4xl text-white leading-none">
                    {k.value}
                  </div>
                  <div className="text-xs text-[#6B7280] font-medium">{k.unit}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8A9099]">
                  <span
                    className="px-[7px] py-1 rounded text-[11px] font-bold"
                    style={{ backgroundColor: k.iconBg, color: k.accent }}
                  >
                    {k.deltaTag}
                  </span>
                  {k.hint}
                </div>
              </div>
            ))}
          </section>

          {/* Secondary Metrics */}
          <section className="grid grid-cols-3 gap-4">
            {secondary.map((s, i) => (
              <div
                key={i}
                className="bg-[#16181D] border border-[#23262C] rounded-2xl p-[18px] flex items-center justify-between gap-[18px] hover:border-[#33383F]"
              >
                <div className="min-w-0">
                  <div className="text-xs text-[#9AA1AA] font-medium">{s.label}</div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <div className="font-bold text-2xl text-white leading-none">
                      {s.value}
                    </div>
                    <div className="text-xs text-[#6B7280]">{s.unit}</div>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#23262C] mt-[14px] overflow-hidden w-[190px]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: s.pct, backgroundColor: s.accent }}
                    ></div>
                  </div>
                </div>
                <div
                  className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: s.iconBg, color: s.accent }}
                >
                  {s.icon}
                </div>
              </div>
            ))}
          </section>

          {/* Charts and Donut */}
          <section className="grid grid-cols-[1.35fr_1fr] gap-4 items-stretch">
            {/* Bar Chart */}
            <div className="bg-[#16181D] border border-[#23262C] rounded-[18px] p-6 flex flex-col gap-[22px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">
                    Implantações iniciadas x concluídas
                  </div>
                  <div className="text-xs text-[#8A9099] mt-1">Últimos 6 meses</div>
                </div>
                <div className="flex gap-4 text-xs text-[#9AA1AA]">
                  <div className="flex items-center gap-2">
                    <span className="w-[9px] h-[9px] rounded-sm bg-[#8B5CF6]"></span>
                    Iniciadas
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-[9px] h-[9px] rounded-sm bg-[#FFC93C]"></span>
                    Concluídas
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[28px_1fr] gap-3 flex-1">
                <div className="flex flex-col justify-between text-[11.5px] text-[#6B7280] text-right pb-[26px]">
                  <div>8</div>
                  <div>6</div>
                  <div>4</div>
                  <div>2</div>
                  <div>0</div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bottom-[26px] flex flex-col justify-between">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-px bg-[#23262C]"></div>
                    ))}
                  </div>
                  <div className="relative h-full min-h-[240px] grid grid-cols-6 gap-[22px] items-end pb-[26px]">
                    {bars.map((b, i) => {
                      const aH = (b.a / 8) * 100;
                      const bH = (b.b / 8) * 100;
                      return (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-0 h-full justify-end relative"
                        >
                          <div className="flex items-end gap-2 h-full w-full justify-center">
                            <div
                              className="w-[26px] rounded-t-lg rounded-b-[2px] bg-gradient-to-b from-[#A78BFA] to-[#7C3AED] relative"
                              style={{ height: `${aH}%` }}
                            >
                              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11.5px] text-[#C4B5FD] font-semibold">
                                {b.a}
                              </div>
                            </div>
                            <div
                              className="w-[26px] rounded-t-lg rounded-b-[2px] bg-gradient-to-b from-[#FFD764] to-[#F0B429] relative"
                              style={{ height: `${bH}%` }}
                            >
                              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11.5px] text-[#FFC93C] font-semibold">
                                {b.b}
                              </div>
                            </div>
                          </div>
                          <div className="absolute -bottom-[22px] text-xs text-[#8A9099]">
                            {b.m}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-[#16181D] border border-[#23262C] rounded-[18px] p-6 flex flex-col gap-5">
              <div>
                <div className="font-semibold text-white">Revendas por status</div>
                <div className="text-xs text-[#8A9099] mt-1">13 revendas no total</div>
              </div>
              <div className="flex items-center justify-center py-1">
                <div
                  className="relative w-[186px] h-[186px] rounded-full"
                  style={{
                    background: `conic-gradient(${gradientStops})`
                  }}
                >
                  <div className="absolute inset-[26px] rounded-full bg-[#16181D] flex items-center justify-center text-center">
                    <div>
                      <div className="font-bold text-2xl text-white leading-none">
                        13
                      </div>
                      <div className="text-[11.5px] text-[#8A9099] uppercase tracking-wider mt-1">
                        revendas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {statuses.map((s, i) => {
                  const pct = Math.round((s.v / total) * 100);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-1 py-2 border-t border-[#1F2228]"
                    >
                      <span
                        className="w-[9px] h-[9px] rounded-sm flex-shrink-0"
                        style={{ backgroundColor: s.color }}
                      ></span>
                      <div className="flex-1 text-xs text-[#C9CED6]">{s.label}</div>
                      <div className="text-xs text-white font-semibold">{s.n}</div>
                      <div className="text-[12px] text-[#6B7280] w-[42px] text-right">
                        {pct}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Implementations and Sidebar */}
          <section className="grid grid-cols-[1.35fr_1fr] gap-4">
            {/* Table */}
            <div className="bg-[#16181D] border border-[#23262C] rounded-[18px] overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-[26px] py-[22px] pb-4">
                <div className="font-semibold text-white">
                  Implantações em andamento
                </div>
                <div className="text-xs text-[#FFC93C] font-semibold cursor-pointer">
                  Ver todas →
                </div>
              </div>
              <div className="grid grid-cols-[1.6fr_1fr_1.2fr_84px] gap-[14px] px-[26px] py-[10px] text-[11.5px] text-[#6B7280] uppercase tracking-wider border-b border-[#23262C]">
                <div>Revenda</div>
                <div>Etapa</div>
                <div>Progresso</div>
                <div className="text-right">Prazo</div>
              </div>
              {rows.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1.6fr_1fr_1.2fr_84px] gap-[14px] items-center px-[26px] py-[15px] border-b border-[#1C1F25] hover:bg-[#1A1D23]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-[9px] bg-[#23262C] text-[#C4B5FD] flex items-center justify-center text-xs font-bold flex-shrink-0"
                    >
                      {r.ini}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-[#E8EAED] font-medium truncate">
                        {r.name}
                      </div>
                      <div className="text-xs text-[#6B7280]">{r.agent}</div>
                    </div>
                  </div>
                  <div className="text-xs text-[#9AA1AA]">{r.stage}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-[#23262C] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: r.pct, backgroundColor: r.color }}
                      ></div>
                    </div>
                    <div className="text-xs text-[#9AA1AA] w-8">{r.pct}</div>
                  </div>
                  <div className="text-right text-xs font-semibold" style={{ color: r.color }}>
                    {r.due}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Critical Issues */}
              <div className="bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] rounded-[18px] p-6 flex flex-col gap-[14px]">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">Pendências críticas</div>
                  <div className="bg-[#FFC93C] text-[#16181D] text-xs font-bold px-[9px] py-1 rounded-lg">
                    2
                  </div>
                </div>
                {pend.map((p, i) => (
                  <div
                    key={i}
                    className="bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.14)] rounded-[12px] px-[14px] py-[13px]"
                  >
                    <div className="text-xs text-white font-semibold">{p.title}</div>
                    <div className="text-[12px] text-[#DDD6FE] mt-1">{p.meta}</div>
                  </div>
                ))}
                <div className="bg-[#FFC93C] text-[#16181D] text-center text-xs font-bold px-1 py-[11px] rounded-[11px] cursor-pointer hover:bg-[#FFD764]">
                  Resolver pendências
                </div>
              </div>

              {/* Next Trainings */}
              <div className="bg-[#16181D] border border-[#23262C] rounded-[18px] p-6 flex-1">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="font-semibold text-white">Próximos treinamentos</div>
                  <div className="text-xs text-[#8A9099]">Nenhum hoje</div>
                </div>
                {trainings.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-[13px] py-[13px] border-t border-[#1F2228]"
                  >
                    <div className="w-[44px] text-center flex-shrink-0">
                      <div className="font-bold text-lg text-[#FFC93C] leading-none">
                        {t.day}
                      </div>
                      <div className="text-[10.5px] text-[#6B7280] uppercase tracking-wider mt-1">
                        {t.mon}
                      </div>
                    </div>
                    <div className="w-px self-stretch bg-[#23262C]"></div>
                    <div className="min-w-0">
                      <div className="text-xs text-[#E8EAED] font-medium">{t.title}</div>
                      <div className="text-[12px] text-[#8A9099] mt-1">{t.meta}</div>
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
