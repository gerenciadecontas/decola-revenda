'use client';

import { useState } from 'react';
import { LIVE_MODULOS, LIVE_STATUS, toISODate, type Live, type LiveStatus } from './lives';
import { FormError, FormFooter, Modal, fieldStyles, fmtDia, type Table, type Theme } from './ui';

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

const toForm = (live: Live | null, data: string): FormState =>
  live
    ? {
        tema: live.tema,
        data: live.data,
        hora: live.hora,
        duracao: live.duracao != null ? String(live.duracao) : '',
        apresentador: live.apresentador || '',
        modulo: live.modulo || LIVE_MODULOS[0],
        link: live.link || '',
        descricao: live.descricao || '',
        status: live.status,
        repetir: false,
      }
    : { tema: '', data, hora: '19:00', duracao: '60', apresentador: '', modulo: LIVE_MODULOS[0], link: '', descricao: '', status: 'agendada', repetir: false };

export function LiveModal({
  theme,
  table,
  live,
  initialDate,
  onClose,
  onSaved,
}: {
  theme: Theme;
  table: Table<Live>;
  live: Live | null;
  initialDate: string;
  onClose: () => void;
  onSaved?: (data: string) => void;
}) {
  const [form, setForm] = useState<FormState>(() => toForm(live, initialDate));
  const [error, setError] = useState('');
  const { inputStyle, labelStyle } = fieldStyles(theme);
  const editingId = live?.id || null;

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
      table.data.some(l => l.id !== editingId && l.status !== 'cancelada' && l.data === data && l.hora === form.hora)
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
      await table.update(editingId, { ...base, data: form.data });
    } else {
      for (const data of datas) await table.create({ ...base, data });
    }
    onSaved?.(form.data);
    onClose();
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!window.confirm(`Excluir a live "${form.tema}"?`)) return;
    await table.delete_(editingId);
    onClose();
  };

  return (
    <Modal theme={theme} title={editingId ? 'Editar live' : 'Nova live'} onClose={onClose}>
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

          <FormError message={error} />
        </div>

        <FormFooter theme={theme} submitLabel="Salvar live" onCancel={onClose} onDelete={editingId ? handleDelete : undefined} />
      </form>
    </Modal>
  );
}
