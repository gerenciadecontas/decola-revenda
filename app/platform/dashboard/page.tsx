'use client';

import Link from 'next/link';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { useTheme } from '@/app/context/ThemeContext';
import { useState, useEffect } from 'react';
import { useTable } from '@/lib/supabase/hooks';
import { STAGES, PRIORIDADES, PRODUTOS, PARADA_DIAS, diasNaEtapa, type Implantacao } from '../implantacoes/data';
import { getModulos, checkedFrom, CUSTOM_TABLE, PROGRESS_TABLE, temaKey, type CustomRow, type ProgressRow } from '../treinamentos/data';
import { LIVES_TABLE, LIVE_STATUS, liveDate, sortLives, toISODate, type Live } from '../treinamentos/lives';
import { SESSOES_TABLE, SESSAO_STATUS, type SessaoTreinamento } from '../treinamentos/agenda';
import '@/app/globals.css';

const LIGHT_THEME = {
  background: '#F9F7F4',
  cardBg: '#FFFFFF',
  borderColor: '#E8E4DC',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#A0A0A0',
  purple: '#7C5CF0',
  yellow: '#E6B23E',
  green: '#4E8E5B',
};

const DARK_THEME = {
  background: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#2A2D33',
  textPrimary: '#F5F5F5',
  textSecondary: '#B8BFCC',
  textTertiary: '#7A8290',
  purple: '#9D7EFF',
  yellow: '#F5C947',
  green: '#66BB6A',
};

type Theme = typeof LIGHT_THEME;

const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

function Bar({ value, max, color, theme }: { value: number; max: number; color: string; theme: Theme }) {
  return (
    <div style={{ height: '8px', background: theme.borderColor, borderRadius: '99px', overflow: 'hidden' }}>
      <div style={{ height: '100%', background: color, width: `${Math.min(pct(value, max), 100)}%`, transition: 'width 0.3s' }} />
    </div>
  );
}

function StatCard({ theme, label, value, foot, tone }: { theme: Theme; label: string; value: React.ReactNode; foot: string; tone?: 'yellow' | 'purple' }) {
  const toneStyle =
    tone === 'yellow'
      ? { background: 'rgba(230, 178, 62, 0.1)', border: '1px solid #E6B23E', color: '#E6B23E' }
      : tone === 'purple'
        ? { background: 'rgba(123, 92, 240, 0.08)', border: '1px solid #5B43C0', color: '#8B7CF6' }
        : { background: theme.cardBg, border: `1px solid ${theme.borderColor}`, color: theme.textPrimary };
  return (
    <div style={{ background: toneStyle.background, border: toneStyle.border, borderRadius: '18px', padding: '20px' }}>
      <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>{label}</p>
      <div style={{ fontSize: '32px', fontWeight: 700, color: toneStyle.color }}>{value}</div>
      <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '8px 0 0 0' }}>{foot}</p>
    </div>
  );
}

function Panel({ theme, title, action, children }: { theme: Theme; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '18px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 20px 0' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Empty({ theme, text }: { theme: Theme; text: string }) {
  return <p style={{ fontSize: '13px', color: theme.textTertiary, margin: 0, padding: '12px 0', textAlign: 'center' }}>{text}</p>;
}

export default function DashboardPage() {
  const { isDark } = useTheme();
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  const { data: implantacoes } = useTable<Implantacao>('implantacoes');
  const { data: lives } = useTable<Live>(LIVES_TABLE);
  const { data: sessoes } = useTable<SessaoTreinamento>(SESSOES_TABLE);
  const [tab, setTab] = useState<'implantacoes' | 'jornada'>('implantacoes');
  const { data: custom } = useTable<CustomRow>(CUSTOM_TABLE);
  const { data: progress } = useTable<ProgressRow>(PROGRESS_TABLE, 'tema_key');
  const checked = checkedFrom(progress);
  const [metaMes, setMetaMes] = useState(10);

  useEffect(() => {
    try {
      const meta = localStorage.getItem('meta-implantacoes-mes');
      if (meta) setMetaMes(parseInt(meta));
    } catch {}
  }, []);

  // Implantações
  const agora = new Date();
  const doMesAtual = (iso?: string) => {
    if (!iso) return false;
    const d = new Date(iso);
    return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
  };

  const emAndamento = implantacoes.filter(i => i.status === 'em-andamento');
  const implantacoesDoMes = implantacoes.filter(i => doMesAtual(i.created_at)).length;
  const atingiuMeta = implantacoesDoMes >= metaMes;
  const semRetorno = implantacoes.filter(i => i.etapa === 'sem-retorno').length;
  const concluidasMes = implantacoes.filter(i => i.status === 'concluida' && doMesAtual(i.etapa_desde)).length;
  const tempoMedio = emAndamento.length
    ? Math.round(emAndamento.reduce((s, i) => s + diasNaEtapa(i), 0) / emAndamento.length)
    : 0;

  const porEtapa = STAGES.map(s => {
    const lista = implantacoes.filter(i => i.etapa === s.id);
    const media = lista.length ? Math.round(lista.reduce((acc, i) => acc + diasNaEtapa(i), 0) / lista.length) : 0;
    return { ...s, count: lista.length, media };
  });
  const maxEtapa = Math.max(...porEtapa.map(s => s.count), 1);

  const precisaAcao = emAndamento
    .filter(i => i.etapa === 'sem-retorno' || diasNaEtapa(i) >= PARADA_DIAS)
    .sort((a, b) => diasNaEtapa(b) - diasNaEtapa(a))
    .slice(0, 6);

  const porPrioridade = Object.entries(PRIORIDADES).map(([k, v]) => ({ ...v, count: emAndamento.filter(i => i.prioridade === k).length }));
  const porProduto = PRODUTOS.map(p => ({ label: p, count: emAndamento.filter(i => i.produto === p).length }));

  // Jornada de capacitação
  const modulos = getModulos(custom).map(({ id, ...m }) => {
    const dias = m.items.map(item => {
      const feitos = item.temas.filter((_, idx) => checked[temaKey(id, item.day, idx)]).length;
      return { ...item, feitos, total: item.temas.length };
    });
    const temasTotal = dias.reduce((s, d) => s + d.total, 0);
    const temasFeitos = dias.reduce((s, d) => s + d.feitos, 0);
    const diasFeitos = dias.filter(d => d.feitos === d.total).length;
    const proximo = dias.find(d => d.feitos < d.total);
    return { id, label: m.label, temasTotal, temasFeitos, diasTotal: dias.length, diasFeitos, proximo };
  });
  const temasTotal = modulos.reduce((s, m) => s + m.temasTotal, 0);
  const temasFeitos = modulos.reduce((s, m) => s + m.temasFeitos, 0);
  const diasTotal = modulos.reduce((s, m) => s + m.diasTotal, 0);
  const diasFeitos = modulos.reduce((s, m) => s + m.diasFeitos, 0);
  const modulosFeitos = modulos.filter(m => m.temasFeitos === m.temasTotal).length;

  const prefixoMes = toISODate(agora).slice(0, 7);
  const livesMes = lives.filter(l => l.data.startsWith(prefixoMes));
  const proximasLives = lives
    .filter(l => l.status === 'agendada' && liveDate(l).getTime() >= Date.now())
    .sort(sortLives)
    .slice(0, 3);

  const sessoesMes = sessoes.filter(s => s.data.startsWith(prefixoMes));
  const proximasSessoes = sessoes
    .filter(s => s.status === 'agendado' && new Date(`${s.data}T${s.hora}:00`).getTime() >= Date.now())
    .sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`))
    .slice(0, 3);

  const grid4: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' };
  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '24px' };
  const linkStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: theme.purple, textDecoration: 'none' };

  return (
    <PlatformLayout currentPage="dashboard">
      <div style={{ padding: '32px', paddingTop: '0', background: theme.background, minHeight: '100vh' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 8px 0' }}>Dashboard</h1>
          <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0 }}>
            Relatório consolidado da plataforma · {agora.toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: isDark ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.05)', padding: '8px', borderRadius: '12px', width: 'fit-content' }}>
          {([
            ['implantacoes', 'Implantações'],
            ['jornada', 'Jornada de capacitação'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                border: 'none',
                background: tab === id ? '#7C5CF0' : 'transparent',
                color: tab === id ? '#fff' : theme.textSecondary,
                fontSize: '14px',
                fontWeight: 700,
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'implantacoes' && (
          <>
            <div style={grid4}>
              <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '18px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>Meta do mês</p>
                  <span style={{ fontSize: '12px', background: atingiuMeta ? theme.green : theme.yellow, color: atingiuMeta ? '#fff' : '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    {pct(implantacoesDoMes, metaMes)}%
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: theme.textPrimary }}>{implantacoesDoMes}</div>
                  <span style={{ fontSize: '14px', color: theme.textSecondary }}>de {metaMes}</span>
                </div>
                <Bar value={implantacoesDoMes} max={metaMes} color={atingiuMeta ? theme.green : theme.yellow} theme={theme} />
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '8px 0 0 0' }}>implantações este mês</p>
              </div>

              <StatCard theme={theme} label="Implantações ativas" value={emAndamento.length} foot="em andamento no pipeline" />
              <StatCard
                theme={theme}
                tone="yellow"
                label="Sem retorno"
                value={
                  <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '12px' }}>
                    {semRetorno}
                    <span style={{ fontSize: '11px', background: '#E6B23E', color: '#0E1013', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>risco</span>
                  </span>
                }
                foot="revendas sem retorno"
              />
              <StatCard
                theme={theme}
                tone="purple"
                label="Tempo médio na etapa"
                value={`${tempoMedio}d`}
                foot={emAndamento.length ? 'média das revendas em andamento' : 'sem revendas em andamento'}
              />
              <StatCard theme={theme} label="Concluídas no mês" value={concluidasMes} foot="chegaram em Ativou 3 clientes" />
            </div>

            <div style={grid2}>
              <Panel theme={theme} title="Revendas por etapa" action={<Link href="/platform/implantacoes" style={linkStyle}>Ver pipeline →</Link>}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {porEtapa.map(s => (
                    <div key={s.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.c }} />
                          <span style={{ fontSize: '14px', fontWeight: 600, color: theme.textPrimary }}>{s.nome}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: theme.textSecondary }}>{s.count}</span>
                          <span style={{ fontSize: '12px', color: theme.textTertiary, minWidth: '76px', textAlign: 'right' }}>
                            {s.count ? `${s.media}d em média` : '—'}
                          </span>
                        </div>
                      </div>
                      <Bar value={s.count} max={maxEtapa} color={s.c} theme={theme} />
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel theme={theme} title="Precisa de ação">
                {precisaAcao.length === 0 ? (
                  <Empty theme={theme} text={`Nenhuma revenda sem retorno ou parada há ${PARADA_DIAS}+ dias.`} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {precisaAcao.map((item, i) => {
                      const etapa = STAGES.find(s => s.id === item.etapa);
                      const prio = PRIORIDADES[item.prioridade] || PRIORIDADES.normal;
                      const dias = diasNaEtapa(item);
                      return (
                        <div
                          key={item.id}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < precisaAcao.length - 1 ? `1px solid ${theme.borderColor}` : 'none' }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: theme.textPrimary, margin: '0 0 4px 0' }}>
                              {item.codigo ? `${item.codigo} · ` : ''}
                              {item.revenda}
                            </h4>
                            <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                              {dias === 0 ? 'Entrou hoje' : `Parada há ${dias} dia${dias > 1 ? 's' : ''}`} em {etapa?.nome}
                            </p>
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: prio.c, background: `${prio.c}22`, padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                            {prio.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>
            </div>

            <div style={grid2}>
              <Panel theme={theme} title="Em andamento por prioridade">
                {emAndamento.length === 0 ? (
                  <Empty theme={theme} text="Sem revendas em andamento." />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {porPrioridade.map(p => (
                      <div key={p.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                          <span style={{ fontWeight: 600, color: theme.textPrimary }}>{p.label}</span>
                          <span style={{ color: theme.textSecondary }}>{p.count} · {pct(p.count, emAndamento.length)}%</span>
                        </div>
                        <Bar value={p.count} max={emAndamento.length} color={p.c} theme={theme} />
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel theme={theme} title="Em andamento por produto">
                {emAndamento.length === 0 ? (
                  <Empty theme={theme} text="Sem revendas em andamento." />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {porProduto.map(p => (
                      <div key={p.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                          <span style={{ fontWeight: 600, color: theme.textPrimary }}>{p.label}</span>
                          <span style={{ color: theme.textSecondary }}>{p.count} · {pct(p.count, emAndamento.length)}%</span>
                        </div>
                        <Bar value={p.count} max={emAndamento.length} color={theme.purple} theme={theme} />
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </>
        )}

        {tab === 'jornada' && (
          <>
            <div style={grid4}>
              <StatCard theme={theme} tone="purple" label="Progresso geral" value={`${pct(temasFeitos, temasTotal)}%`} foot="de todos os treinamentos" />
              <StatCard theme={theme} tone="yellow" label="Temas concluídos" value={`${temasFeitos}/${temasTotal}`} foot="temas marcados como feitos" />
              <StatCard theme={theme} label="Dias concluídos" value={`${diasFeitos}/${diasTotal}`} foot="dias com todos os temas feitos" />
              <StatCard theme={theme} label="Módulos concluídos" value={`${modulosFeitos}/${modulos.length}`} foot="LC WEB, LC ERP e serviços" />
            </div>

            <div style={{ ...grid2, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {modulos.map(m => {
                const progresso = pct(m.temasFeitos, m.temasTotal);
                const completo = m.temasFeitos === m.temasTotal;
                return (
                  <Panel key={m.id} theme={theme} title={m.label}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '32px', fontWeight: 700, color: completo ? theme.green : theme.purple }}>{progresso}%</span>
                      <span style={{ fontSize: '13px', color: theme.textSecondary }}>concluído</span>
                    </div>
                    <Bar value={m.temasFeitos} max={m.temasTotal} color={completo ? theme.green : theme.purple} theme={theme} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: theme.textSecondary, margin: '14px 0' }}>
                      <span>{m.temasFeitos} de {m.temasTotal} temas</span>
                      <span>{m.diasFeitos} de {m.diasTotal} dias</span>
                    </div>
                    <p style={{ fontSize: '13px', margin: 0, paddingTop: '12px', borderTop: `1px solid ${theme.borderColor}`, color: completo ? theme.green : theme.textPrimary, fontWeight: 600 }}>
                      {completo || !m.proximo ? '✓ Módulo concluído' : `Próximo: Dia ${m.proximo.day} · ${m.proximo.title} (${m.proximo.feitos}/${m.proximo.total})`}
                    </p>
                  </Panel>
                );
              })}
            </div>

            <div style={grid2}>
              <Panel theme={theme} title="Lives do mês" action={<Link href="/platform/treinamentos" style={linkStyle}>Abrir agenda →</Link>}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  {[
                    ['Agendadas', livesMes.filter(l => l.status === 'agendada').length, LIVE_STATUS.agendada.c],
                    ['Realizadas', livesMes.filter(l => l.status === 'realizada').length, LIVE_STATUS.realizada.c],
                    ['Canceladas', livesMes.filter(l => l.status === 'cancelada').length, LIVE_STATUS.cancelada.c],
                  ].map(([label, n, c]) => (
                    <div key={label as string} style={{ border: `1px solid ${theme.borderColor}`, borderRadius: '12px', padding: '12px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: c as string }}>{n}</div>
                      <div style={{ fontSize: '12px', color: theme.textSecondary }}>{label}</div>
                    </div>
                  ))}
                </div>
                {proximasLives.length === 0 ? (
                  <Empty theme={theme} text="Nenhuma live agendada daqui para frente." />
                ) : (
                  proximasLives.map((l, i) => (
                    <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 0', borderTop: i === 0 ? `1px solid ${theme.borderColor}` : 'none' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: theme.textPrimary, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.tema}</span>
                      <span style={{ fontSize: '13px', color: theme.textSecondary, whiteSpace: 'nowrap' }}>
                        {new Date(`${l.data}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} · {l.hora}
                      </span>
                    </div>
                  ))
                )}
              </Panel>

              <Panel theme={theme} title="Treinamentos agendados no mês" action={<Link href="/platform/treinamentos" style={linkStyle}>Abrir agenda →</Link>}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  {(Object.keys(SESSAO_STATUS) as (keyof typeof SESSAO_STATUS)[]).map(st => (
                    <div key={st} style={{ border: `1px solid ${theme.borderColor}`, borderRadius: '12px', padding: '12px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: SESSAO_STATUS[st].c }}>{sessoesMes.filter(s => s.status === st).length}</div>
                      <div style={{ fontSize: '12px', color: theme.textSecondary }}>{SESSAO_STATUS[st].label}s</div>
                    </div>
                  ))}
                </div>
                {proximasSessoes.length === 0 ? (
                  <Empty theme={theme} text="Nenhum treinamento agendado daqui para frente." />
                ) : (
                  proximasSessoes.map((s, i) => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 0', borderTop: i === 0 ? `1px solid ${theme.borderColor}` : 'none' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: theme.textPrimary, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Dia {s.dia} · {s.titulo}
                        {s.revenda ? ` · ${s.revenda}` : ''}
                      </span>
                      <span style={{ fontSize: '13px', color: theme.textSecondary, whiteSpace: 'nowrap' }}>
                        {new Date(`${s.data}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} · {s.hora}
                      </span>
                    </div>
                  ))
                )}
              </Panel>
            </div>
          </>
        )}
      </div>
    </PlatformLayout>
  );
}
