'use client';

import { useState } from 'react';
import { COR_LIVE, COR_TREINAMENTO, SESSAO_STATUS, type SessaoTreinamento } from './agenda';
import type { ModuloId, TreinamentoItem } from './data';
import { LIVE_STATUS, toISODate, type Live } from './lives';
import { LiveModal } from './LiveModal';
import { TreinamentoModal } from './TreinamentoModal';
import { Modal, MonthCalendar, MonthNav, WEEKDAYS, fmtDia, monthPrefix, primaryBtn, type CalEvent, type Table, type Theme } from './ui';

type Modulo = { id: ModuloId; label: string; items: TreinamentoItem[] };
type Filtro = 'tudo' | 'lives' | 'treinamentos';

type Item = {
  key: string;
  tipo: 'live' | 'treinamento';
  data: string;
  hora: string;
  titulo: string;
  detalhe: string;
  status: { label: string; c: string };
  cancelado: boolean;
  feito: boolean;
  abrir: () => void;
};

export function AgendaTab({
  theme,
  isDark,
  lives,
  sessoes,
  modulos,
  revendas,
}: {
  theme: Theme;
  isDark: boolean;
  lives: Table<Live>;
  sessoes: Table<SessaoTreinamento>;
  modulos: Modulo[];
  revendas: string[];
}) {
  const hoje = new Date();
  const hojeISO = toISODate(hoje);
  const [mes, setMes] = useState(() => new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [filtro, setFiltro] = useState<Filtro>('tudo');
  const [escolhaDia, setEscolhaDia] = useState<string | null>(null);
  const [liveModal, setLiveModal] = useState<{ live: Live | null; data: string } | null>(null);
  const [treinoModal, setTreinoModal] = useState<{ sessao: SessaoTreinamento | null; data: string } | null>(null);

  const prefixo = monthPrefix(mes);
  const dataPadrao = prefixo === hojeISO.slice(0, 7) ? hojeISO : `${prefixo}-01`;
  const irParaMes = (data: string) => setMes(new Date(Number(data.slice(0, 4)), Number(data.slice(5, 7)) - 1, 1));
  const labelModulo = (id: ModuloId) => modulos.find(m => m.id === id)?.label || id;

  const itensLives: Item[] = lives.data
    .filter(l => l.data.startsWith(prefixo))
    .map(l => ({
      key: `live-${l.id}`,
      tipo: 'live',
      data: l.data,
      hora: l.hora,
      titulo: l.tema,
      detalhe: [l.duracao ? `${l.duracao} min` : '', l.modulo, l.apresentador && `com ${l.apresentador}`].filter(Boolean).join(' · '),
      status: LIVE_STATUS[l.status],
      cancelado: l.status === 'cancelada',
      feito: l.status === 'realizada',
      abrir: () => setLiveModal({ live: l, data: l.data }),
    }));

  const itensTreinos: Item[] = sessoes.data
    .filter(s => s.data.startsWith(prefixo))
    .map(s => ({
      key: `treino-${s.id}`,
      tipo: 'treinamento',
      data: s.data,
      hora: s.hora,
      titulo: `${labelModulo(s.modulo)} · Dia ${s.dia} · ${s.titulo}`,
      detalhe: [s.duracao ? `${s.duracao} min` : '', s.revenda, s.instrutor && `com ${s.instrutor}`].filter(Boolean).join(' · '),
      status: SESSAO_STATUS[s.status],
      cancelado: s.status === 'cancelado',
      feito: s.status === 'realizado',
      abrir: () => setTreinoModal({ sessao: s, data: s.data }),
    }));

  const itens = [...(filtro !== 'treinamentos' ? itensLives : []), ...(filtro !== 'lives' ? itensTreinos : [])].sort((a, b) =>
    `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`)
  );

  const events: CalEvent[] = itens.map(i => ({
    key: i.key,
    data: i.data,
    hora: i.hora,
    label: i.tipo === 'live' ? i.titulo : i.titulo.replace(/^.*? · Dia /, 'Dia '),
    color: i.tipo === 'live' ? COR_LIVE : COR_TREINAMENTO,
    cancelled: i.cancelado,
    done: i.feito,
    onClick: i.abrir,
  }));

  const agoraISO = `${hojeISO}T${String(hoje.getHours()).padStart(2, '0')}:${String(hoje.getMinutes()).padStart(2, '0')}`;
  const proximo = [
    ...lives.data.filter(l => l.status === 'agendada').map(l => ({ quando: `${l.data}T${l.hora}`, data: l.data, hora: l.hora, titulo: `Live · ${l.tema}` })),
    ...sessoes.data.filter(s => s.status === 'agendado').map(s => ({ quando: `${s.data}T${s.hora}`, data: s.data, hora: s.hora, titulo: `Treinamento · ${s.titulo}` })),
  ]
    .filter(x => x.quando >= agoraISO)
    .sort((a, b) => a.quando.localeCompare(b.quando))[0];

  const stat = (label: string, value: React.ReactNode, foot: string, accent?: string) => (
    <div style={{ background: theme.cardBg, border: `1px solid ${accent || theme.borderColor}`, borderRadius: '16px', padding: '20px' }}>
      <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>{label}</p>
      <div style={{ fontSize: '28px', fontWeight: 700, color: accent || theme.textPrimary, marginBottom: '6px' }}>{value}</div>
      <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{foot}</p>
    </div>
  );

  const chip = (id: Filtro, label: string, cor?: string) => (
    <button
      key={id}
      onClick={() => setFiltro(id)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        border: `1px solid ${filtro === id ? cor || theme.textPrimary : theme.borderColor}`,
        background: filtro === id ? `${cor || '#7C5CF0'}1F` : theme.cardBg,
        color: theme.textPrimary,
        borderRadius: '999px',
        padding: '7px 14px',
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: 'pointer',
      }}
    >
      {cor && <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: cor }} />}
      {label}
    </button>
  );

  const secondaryBtn: React.CSSProperties = { ...primaryBtn, background: theme.cardBg, color: theme.textPrimary, border: `1px solid ${theme.borderColor}` };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {stat('Treinamentos no mês', itensTreinos.filter(i => !i.cancelado).length, `${itensTreinos.filter(i => i.feito).length} realizados`, COR_TREINAMENTO)}
        {stat('Lives no mês', itensLives.filter(i => !i.cancelado).length, `${itensLives.filter(i => i.feito).length} realizadas`, COR_LIVE)}
        {stat('Total previsto', itensTreinos.filter(i => !i.cancelado).length + itensLives.filter(i => !i.cancelado).length, 'compromissos no mês')}
        {stat(
          'Próximo compromisso',
          <span style={{ fontSize: '18px' }}>{proximo ? `${fmtDia(proximo.data)} · ${proximo.hora}` : '—'}</span>,
          proximo ? proximo.titulo : 'nada agendado'
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <MonthNav theme={theme} mes={mes} onChange={setMes} />
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setLiveModal({ live: null, data: dataPadrao })} style={secondaryBtn}>
            + Nova live
          </button>
          <button onClick={() => setTreinoModal({ sessao: null, data: dataPadrao })} style={primaryBtn}>
            + Agendar treinamento
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {chip('tudo', 'Tudo')}
        {chip('treinamentos', 'Treinamentos', COR_TREINAMENTO)}
        {chip('lives', 'Lives', COR_LIVE)}
      </div>

      <MonthCalendar theme={theme} isDark={isDark} mes={mes} events={events} onDayClick={setEscolhaDia} />

      <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: theme.textPrimary }}>Previsto para o mês</h3>
        {itens.length === 0 ? (
          <p style={{ margin: 0, padding: '12px 0', textAlign: 'center', fontSize: '13px', color: theme.textTertiary }}>
            Nada previsto neste mês. Clique num dia do calendário para agendar.
          </p>
        ) : (
          itens.map((it, i) => (
            <div
              key={it.key}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: i < itens.length - 1 ? `1px solid ${theme.borderColor}` : 'none', flexWrap: 'wrap' }}
            >
              <div style={{ width: '56px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: theme.textPrimary, lineHeight: 1 }}>{it.data.slice(8, 10)}</div>
                <div style={{ fontSize: '11px', color: theme.textTertiary, textTransform: 'uppercase', marginTop: '4px' }}>
                  {WEEKDAYS[new Date(`${it.data}T00:00:00`).getDay()]}
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: it.tipo === 'live' ? COR_LIVE : '#B88A1F',
                  background: `${it.tipo === 'live' ? COR_LIVE : COR_TREINAMENTO}22`,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  flexShrink: 0,
                }}
              >
                {it.tipo === 'live' ? 'Live' : 'Treinamento'}
              </span>
              <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: theme.textPrimary, textDecoration: it.cancelado ? 'line-through' : 'none' }}>
                  {it.titulo}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: theme.textSecondary }}>{[it.hora, it.detalhe].filter(Boolean).join(' · ')}</p>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: it.status.c, background: `${it.status.c}22`, padding: '4px 10px', borderRadius: '999px' }}>
                {it.status.label}
              </span>
              <button
                onClick={it.abrir}
                style={{ background: 'transparent', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}
              >
                Editar
              </button>
            </div>
          ))
        )}
      </div>

      {escolhaDia && (
        <Modal theme={theme} title={`Agendar em ${fmtDia(escolhaDia)}`} onClose={() => setEscolhaDia(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '24px' }}>
            {[
              { label: 'Treinamento', desc: 'Um dia do roteiro de um módulo', cor: COR_TREINAMENTO, abrir: () => setTreinoModal({ sessao: null, data: escolhaDia }) },
              { label: 'Live', desc: 'Uma transmissão com tema livre', cor: COR_LIVE, abrir: () => setLiveModal({ live: null, data: escolhaDia }) },
            ].map(op => (
              <button
                key={op.label}
                onClick={() => {
                  setEscolhaDia(null);
                  op.abrir();
                }}
                style={{
                  textAlign: 'left',
                  border: `1px solid ${theme.borderColor}`,
                  borderTop: `4px solid ${op.cor}`,
                  background: theme.background,
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: 700, color: theme.textPrimary, marginBottom: '4px' }}>{op.label}</div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>{op.desc}</div>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {liveModal && (
        <LiveModal theme={theme} table={lives} live={liveModal.live} initialDate={liveModal.data} onClose={() => setLiveModal(null)} onSaved={irParaMes} />
      )}

      {treinoModal && (
        <TreinamentoModal
          theme={theme}
          table={sessoes}
          sessao={treinoModal.sessao}
          initialDate={treinoModal.data}
          modulos={modulos}
          revendas={revendas}
          onClose={() => setTreinoModal(null)}
          onSaved={irParaMes}
        />
      )}
    </div>
  );
}
