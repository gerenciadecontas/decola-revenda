'use client';

import { useState } from 'react';
import { LIVE_STATUS, isPendente, liveDate, sortLives, toISODate, type Live } from './lives';
import { LiveModal } from './LiveModal';
import { MonthNav, WEEKDAYS, fmtDia, monthPrefix, primaryBtn, type Table, type Theme } from './ui';

export function LivesTab({ theme, table }: { theme: Theme; table: Table<Live> }) {
  const lives = table.data;
  const hoje = new Date();
  const hojeISO = toISODate(hoje);
  const [mes, setMes] = useState(() => new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [modal, setModal] = useState<{ live: Live | null; data: string } | null>(null);

  const prefixo = monthPrefix(mes);
  const doMes = lives.filter(l => l.data.startsWith(prefixo)).sort(sortLives);
  const ativasMes = doMes.filter(l => l.status !== 'cancelada');
  const proxima = lives
    .filter(l => l.status === 'agendada' && liveDate(l).getTime() >= Date.now())
    .sort(sortLives)[0];
  const mesLabel = mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const stat = (label: string, value: React.ReactNode, foot: string, accent?: string) => (
    <div style={{ background: theme.cardBg, border: `1px solid ${accent || theme.borderColor}`, borderRadius: '16px', padding: '20px' }}>
      <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>{label}</p>
      <div style={{ fontSize: '28px', fontWeight: 700, color: accent || theme.textPrimary, marginBottom: '6px' }}>{value}</div>
      <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>{foot}</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {stat('Lives no mês', ativasMes.length, mesLabel)}
        {stat('Agendadas', doMes.filter(l => l.status === 'agendada').length, 'neste mês', theme.purple)}
        {stat('Realizadas', doMes.filter(l => l.status === 'realizada').length, 'neste mês', '#4E8E5B')}
        {stat(
          'Próxima live',
          <span style={{ fontSize: '18px' }}>{proxima ? `${fmtDia(proxima.data)} · ${proxima.hora}` : '—'}</span>,
          proxima ? proxima.tema : 'nenhuma live agendada',
          theme.yellow
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <MonthNav theme={theme} mes={mes} onChange={setMes} />
        <button
          onClick={() => setModal({ live: null, data: prefixo === hojeISO.slice(0, 7) ? hojeISO : `${prefixo}-01` })}
          style={primaryBtn}
        >
          + Nova live
        </button>
      </div>

      <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: theme.textPrimary }}>Lives do mês</h3>
        {doMes.length === 0 ? (
          <p style={{ margin: 0, padding: '12px 0', textAlign: 'center', fontSize: '13px', color: theme.textTertiary }}>
            Nenhuma live neste mês. Use "+ Nova live" ou agende pela aba Agenda.
          </p>
        ) : (
          doMes.map((l, i) => {
            const st = LIVE_STATUS[l.status];
            const pendente = isPendente(l);
            return (
              <div
                key={l.id}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: i < doMes.length - 1 ? `1px solid ${theme.borderColor}` : 'none', flexWrap: 'wrap' }}
              >
                <div style={{ width: '56px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: theme.textPrimary, lineHeight: 1 }}>{l.data.slice(8, 10)}</div>
                  <div style={{ fontSize: '11px', color: theme.textTertiary, textTransform: 'uppercase', marginTop: '4px' }}>
                    {WEEKDAYS[new Date(`${l.data}T00:00:00`).getDay()]}
                  </div>
                </div>
                <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: theme.textPrimary, textDecoration: l.status === 'cancelada' ? 'line-through' : 'none' }}>
                    {l.tema}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: theme.textSecondary }}>
                    {[`${l.hora}${l.duracao ? ` · ${l.duracao} min` : ''}`, l.modulo, l.apresentador && `com ${l.apresentador}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: pendente ? '#E2944A' : st.c, background: `${pendente ? '#E2944A' : st.c}22`, padding: '4px 10px', borderRadius: '999px' }}>
                    {pendente ? 'Aconteceu? Confirme' : st.label}
                  </span>
                  {pendente && (
                    <button
                      onClick={() => l.id && table.update(l.id, { status: 'realizada' })}
                      style={{ background: 'transparent', border: `1px solid ${theme.borderColor}`, borderRadius: '8px', padding: '6px 10px', color: '#4E8E5B', cursor: 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'inherit' }}
                    >
                      Marcar realizada
                    </button>
                  )}
                  {l.link && (
                    <a href={l.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: 600, color: theme.purple, textDecoration: 'none' }}>
                      Abrir link ↗
                    </a>
                  )}
                  <button
                    onClick={() => setModal({ live: l, data: l.data })}
                    style={{ background: 'transparent', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {modal && (
        <LiveModal
          theme={theme}
          table={table}
          live={modal.live}
          initialDate={modal.data}
          onClose={() => setModal(null)}
          onSaved={data => setMes(new Date(Number(data.slice(0, 4)), Number(data.slice(5, 7)) - 1, 1))}
        />
      )}
    </div>
  );
}
