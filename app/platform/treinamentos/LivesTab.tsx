'use client';

import { useState } from 'react';
import { useLocalTable } from '@/lib/supabase/hooks';
import { LIVES_TABLE, LIVE_MODULOS, LIVE_STATUS, isPendente, liveDate, sortLives, toISODate, type Live, type LiveStatus } from './lives';

type Theme = {
  background: string;
  cardBg: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  purple: string;
  yellow: string;
};

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

type FormState = {
  tema: string;
  data: string;
  hora: string;
  duracao: string;
  apresentador: string;
  modulo: string;
  link: string;
  descricao: string;
  status: LiveStatus;
  repetir: boolean;
};

const emptyForm = (data: string): FormState => ({
  tema: '',
  data,
  hora: '19:00',
  duracao: '60',
  apresentador: '',
  modulo: LIVE_MODULOS[0],
  link: '',
  descricao: '',
  status: 'agendada',
  repetir: false,
});

const fmtDia = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });

export function LivesTab({ theme, isDark }: { theme: Theme; isDark: boolean }) {
  const { data: lives, create, update, delete_ } = useLocalTable<Live>(LIVES_TABLE);
  const hoje = new Date();
  const hojeISO = toISODate(hoje);
  const [mes, setMes] = useState(() => new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(hojeISO));
  const [error, setError] = useState('');

  const ano = mes.getFullYear();
  const m = mes.getMonth();
  const prefixo = `${ano}-${String(m + 1).padStart(2, '0')}`;
  const doMes = lives.filter(l => l.data.startsWith(prefixo)).sort(sortLives);
  const porDia = doMes.reduce<Record<string, Live[]>>((acc, l) => {
    (acc[l.data] ||= []).push(l);
    return acc;
  }, {});

  const offset = new Date(ano, m, 1).getDay();
  const diasNoMes = new Date(ano, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: diasNoMes }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const ativasMes = doMes.filter(l => l.status !== 'cancelada');
  const proxima = lives
    .filter(l => l.status === 'agendada' && liveDate(l).getTime() >= Date.now())
    .sort(sortLives)[0];

  const mesLabel = mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const openNew = (data: string) => {
    setEditingId(null);
    setForm(emptyForm(data));
    setError('');
    setModalOpen(true);
  };

  const openEdit = (l: Live) => {
    setEditingId(l.id || null);
    setForm({
      tema: l.tema,
      data: l.data,
      hora: l.hora,
      duracao: l.duracao != null ? String(l.duracao) : '',
      apresentador: l.apresentador || '',
      modulo: l.modulo || LIVE_MODULOS[0],
      link: l.link || '',
      descricao: l.descricao || '',
      status: l.status,
      repetir: false,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tema = form.tema.trim();
    const link = form.link.trim();
    if (!tema) return setError('Informe o tema da live.');
    if (!form.data) return setError('Informe a data.');
    if (!form.hora) return setError('Informe o horário.');
    if (link && !/^https?:\/\//i.test(link)) return setError('O link precisa começar com http:// ou https://');

    const datas = [form.data];
    if (!editingId && form.repetir) {
      const d = new Date(`${form.data}T00:00:00`);
      const mesBase = d.getMonth();
      for (d.setDate(d.getDate() + 7); d.getMonth() === mesBase; d.setDate(d.getDate() + 7)) datas.push(toISODate(d));
    }

    const conflito = datas.find(data =>
      lives.some(l => l.id !== editingId && l.status !== 'cancelada' && l.data === data && l.hora === form.hora)
    );
    if (conflito) return setError(`Já existe uma live em ${fmtDia(conflito)} às ${form.hora}.`);

    const base = {
      tema,
      hora: form.hora,
      duracao: form.duracao === '' ? undefined : Math.max(0, Number(form.duracao)),
      apresentador: form.apresentador.trim(),
      modulo: form.modulo,
      link,
      descricao: form.descricao.trim(),
      status: form.status,
    };

    if (editingId) {
      await update(editingId, { ...base, data: form.data });
    } else {
      for (const data of datas) await create({ ...base, data });
    }
    setMes(new Date(Number(form.data.slice(0, 4)), Number(form.data.slice(5, 7)) - 1, 1));
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!window.confirm(`Excluir a live "${form.tema}"?`)) return;
    await delete_(editingId);
    setModalOpen(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: theme.background,
    border: `1px solid ${theme.borderColor}`,
    borderRadius: '10px',
    color: theme.textPrimary,
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: theme.textSecondary, display: 'block', marginBottom: '6px' };
  const navBtn: React.CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.borderColor}`,
    borderRadius: '10px',
    padding: '8px 12px',
    color: theme.textPrimary,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'inherit',
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={navBtn} onClick={() => setMes(new Date(ano, m - 1, 1))} aria-label="Mês anterior">‹</button>
          <button style={navBtn} onClick={() => setMes(new Date(hoje.getFullYear(), hoje.getMonth(), 1))}>Hoje</button>
          <button style={navBtn} onClick={() => setMes(new Date(ano, m + 1, 1))} aria-label="Próximo mês">›</button>
          <h3 style={{ margin: '0 0 0 8px', fontSize: '18px', fontWeight: 700, color: theme.textPrimary, textTransform: 'capitalize' }}>{mesLabel}</h3>
        </div>
        <button
          onClick={() => openNew(prefixo === hojeISO.slice(0, 7) ? hojeISO : `${prefixo}-01`)}
          style={{ padding: '11px 18px', background: '#E6B23E', border: 'none', borderRadius: '12px', color: '#1A1A1A', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap' }}
        >
          + Nova live
        </button>
      </div>

      <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', overflowX: 'auto', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))', minWidth: '770px' }}>
          {WEEKDAYS.map(w => (
            <div key={w} style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 700, color: theme.textTertiary, textTransform: 'uppercase', borderBottom: `1px solid ${theme.borderColor}` }}>
              {w}
            </div>
          ))}
          {cells.map((dia, i) => {
            const iso = dia ? `${prefixo}-${String(dia).padStart(2, '0')}` : '';
            const doDia = dia ? porDia[iso] || [] : [];
            const isHoje = iso === hojeISO;
            return (
              <div
                key={i}
                onClick={() => dia && openNew(iso)}
                title={dia ? 'Clique para agendar uma live neste dia' : undefined}
                style={{
                  minHeight: '104px',
                  padding: '8px',
                  borderRight: (i + 1) % 7 ? `1px solid ${theme.borderColor}` : 'none',
                  borderBottom: i < cells.length - 7 ? `1px solid ${theme.borderColor}` : 'none',
                  background: dia ? 'transparent' : isDark ? 'rgba(0,0,0,.18)' : 'rgba(0,0,0,.025)',
                  cursor: dia ? 'pointer' : 'default',
                }}
              >
                {dia && (
                  <>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '13px',
                        fontWeight: 700,
                        marginBottom: '6px',
                        background: isHoje ? '#E6B23E' : 'transparent',
                        color: isHoje ? '#1A1A1A' : theme.textSecondary,
                      }}
                    >
                      {dia}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {doDia.slice(0, 3).map(l => {
                        const st = LIVE_STATUS[l.status];
                        return (
                          <button
                            key={l.id}
                            onClick={e => {
                              e.stopPropagation();
                              openEdit(l);
                            }}
                            title={`${l.hora} · ${l.tema}`}
                            style={{
                              textAlign: 'left',
                              border: 'none',
                              borderLeft: `3px solid ${st.c}`,
                              background: `${st.c}1F`,
                              color: theme.textPrimary,
                              borderRadius: '6px',
                              padding: '4px 6px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              fontFamily: 'inherit',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              textDecoration: l.status === 'cancelada' ? 'line-through' : 'none',
                            }}
                          >
                            {l.hora} {l.tema}
                          </button>
                        );
                      })}
                      {doDia.length > 3 && <span style={{ fontSize: '11px', color: theme.textTertiary, fontWeight: 600 }}>+{doDia.length - 3} lives</span>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: theme.textPrimary }}>Programação do mês</h3>
        {doMes.length === 0 ? (
          <p style={{ margin: 0, padding: '12px 0', textAlign: 'center', fontSize: '13px', color: theme.textTertiary }}>
            Nenhuma live neste mês. Use "+ Nova live" ou clique num dia do calendário.
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
                      onClick={() => l.id && update(l.id, { status: 'realizada' })}
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
                    onClick={() => openEdit(l)}
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

      {modalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '18px', maxWidth: '600px', width: '100%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${theme.borderColor}` }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>{editingId ? 'Editar live' : 'Nova live'}</h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: `1px solid ${theme.borderColor}`, borderRadius: '8px', width: '32px', height: '32px', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px', padding: '20px 24px', overflowY: 'auto' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Tema da live *</label>
                  <input value={form.tema} onChange={e => setForm({ ...form, tema: e.target.value })} placeholder="Ex: Novidades do LC WEB" style={inputStyle} autoFocus />
                </div>

                <div>
                  <label style={labelStyle}>Data *</label>
                  <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Horário *</label>
                    <input type="time" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Duração (min)</label>
                    <input type="number" min={0} step={15} value={form.duracao} onChange={e => setForm({ ...form, duracao: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Módulo</label>
                  <select value={form.modulo} onChange={e => setForm({ ...form, modulo: e.target.value })} style={inputStyle}>
                    {LIVE_MODULOS.map(mod => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Apresentador</label>
                  <input value={form.apresentador} onChange={e => setForm({ ...form, apresentador: e.target.value })} placeholder="Quem conduz a live" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Link da transmissão</label>
                  <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://meet.google.com/..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as LiveStatus })} style={inputStyle}>
                    {Object.entries(LIVE_STATUS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Descrição</label>
                  <textarea
                    value={form.descricao}
                    onChange={e => setForm({ ...form, descricao: e.target.value })}
                    placeholder="Pauta, materiais, público-alvo..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {!editingId && (
                  <label style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: theme.textPrimary, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.repetir}
                      onChange={e => setForm({ ...form, repetir: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#7C5CF0' }}
                    />
                    Repetir toda semana até o fim do mês
                  </label>
                )}

                {error && (
                  <div style={{ gridColumn: '1 / -1', background: 'rgba(217, 83, 79, 0.12)', color: '#D9534F', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
                    {error}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px 24px', borderTop: `1px solid ${theme.borderColor}` }}>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    style={{ background: 'transparent', border: 'none', color: '#D9534F', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}
                  >
                    Excluir
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ marginLeft: 'auto', padding: '10px 18px', background: 'transparent', border: `1px solid ${theme.borderColor}`, borderRadius: '10px', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 18px', background: '#E6B23E', border: 'none', borderRadius: '10px', color: '#1A1A1A', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit' }}
                >
                  Salvar live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
