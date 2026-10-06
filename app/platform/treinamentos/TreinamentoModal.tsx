'use client';

import { useState } from 'react';
import { SESSAO_STATUS, type SessaoStatus, type SessaoTreinamento } from './agenda';
import type { ModuloId, TreinamentoItem } from './data';
import { FormError, FormFooter, Modal, fieldStyles, fmtDia, type Table, type Theme } from './ui';

type Modulo = { id: ModuloId; label: string; items: TreinamentoItem[] };

type FormState = {
  modulo: ModuloId;
  dia: string;
  data: string;
  hora: string;
  duracao: string;
  revenda: string;
  instrutor: string;
  link: string;
  observacoes: string;
  status: SessaoStatus;
};

export function TreinamentoModal({
  theme,
  table,
  sessao,
  initialDate,
  modulos,
  revendas,
  onClose,
  onSaved,
}: {
  theme: Theme;
  table: Table<SessaoTreinamento>;
  sessao: SessaoTreinamento | null;
  initialDate: string;
  modulos: Modulo[];
  revendas: string[];
  onClose: () => void;
  onSaved?: (data: string) => void;
}) {
  const [form, setForm] = useState<FormState>(() =>
    sessao
      ? {
          modulo: sessao.modulo,
          dia: String(sessao.dia),
          data: sessao.data,
          hora: sessao.hora,
          duracao: sessao.duracao != null ? String(sessao.duracao) : '',
          revenda: sessao.revenda || '',
          instrutor: sessao.instrutor || '',
          link: sessao.link || '',
          observacoes: sessao.observacoes || '',
          status: sessao.status,
        }
      : {
          modulo: modulos[0].id,
          dia: String(modulos[0].items[0]?.day ?? ''),
          data: initialDate,
          hora: '09:00',
          duracao: '120',
          revenda: '',
          instrutor: '',
          link: '',
          observacoes: '',
          status: 'agendado',
        }
  );
  const [error, setError] = useState('');
  const { inputStyle, labelStyle } = fieldStyles(theme);
  const editingId = sessao?.id || null;
  const modulo = modulos.find(m => m.id === form.modulo) || modulos[0];
  const item = modulo.items.find(i => String(i.day) === form.dia);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const revenda = form.revenda.trim();
    const link = form.link.trim();
    if (!item && !sessao) return setError('Escolha o treinamento.');
    if (!form.data) return setError('Informe a data.');
    if (!form.hora) return setError('Informe o horário.');
    if (link && !/^https?:\/\//i.test(link)) return setError('O link precisa começar com http:// ou https://');
    if (
      revenda &&
      table.data.some(
        s => s.id !== editingId && s.status !== 'cancelado' && s.data === form.data && s.hora === form.hora && (s.revenda || '').toLowerCase() === revenda.toLowerCase()
      )
    ) {
      return setError(`${revenda} já tem um treinamento em ${fmtDia(form.data)} às ${form.hora}.`);
    }

    const payload = {
      modulo: form.modulo,
      dia: Number(form.dia),
      titulo: item?.title || sessao?.titulo || '',
      data: form.data,
      hora: form.hora,
      duracao: form.duracao === '' ? undefined : Math.max(0, Number(form.duracao)),
      revenda,
      instrutor: form.instrutor.trim(),
      link,
      observacoes: form.observacoes.trim(),
      status: form.status,
    };

    if (editingId) await table.update(editingId, payload);
    else await table.create(payload);
    onSaved?.(form.data);
    onClose();
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!window.confirm('Excluir este treinamento da agenda?')) return;
    await table.delete_(editingId);
    onClose();
  };

  return (
    <Modal theme={theme} title={editingId ? 'Editar treinamento agendado' : 'Agendar treinamento'} onClose={onClose}>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px', padding: '20px 24px', overflowY: 'auto' }}>
          <div>
            <label style={labelStyle}>Módulo *</label>
            <select
              value={form.modulo}
              onChange={e => {
                const novo = modulos.find(m => m.id === e.target.value)!;
                setForm({ ...form, modulo: novo.id, dia: String(novo.items[0]?.day ?? '') });
              }}
              style={inputStyle}
            >
              {modulos.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Treinamento *</label>
            <select value={form.dia} onChange={e => setForm({ ...form, dia: e.target.value })} style={inputStyle}>
              {modulo.items.map(i => (
                <option key={i.day} value={String(i.day)}>Dia {i.day} · {i.title}</option>
              ))}
            </select>
          </div>

          {item && (
            <p style={{ gridColumn: '1 / -1', margin: '-4px 0 0', fontSize: '12px', color: theme.textTertiary }}>
              {item.temas.length} temas{item.obj ? ` · ${item.obj}` : ''}
            </p>
          )}

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
            <label style={labelStyle}>Revenda</label>
            <input value={form.revenda} onChange={e => setForm({ ...form, revenda: e.target.value })} placeholder="Para qual revenda" list="revendas-agenda" style={inputStyle} />
            <datalist id="revendas-agenda">
              {revendas.map(r => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>
          <div>
            <label style={labelStyle}>Instrutor</label>
            <input value={form.instrutor} onChange={e => setForm({ ...form, instrutor: e.target.value })} placeholder="Quem aplica o treinamento" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Link da reunião</label>
            <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://meet.google.com/..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as SessaoStatus })} style={inputStyle}>
              {Object.entries(SESSAO_STATUS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Observações</label>
            <textarea
              value={form.observacoes}
              onChange={e => setForm({ ...form, observacoes: e.target.value })}
              placeholder="Participantes, pendências, materiais..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <FormError message={error} />
        </div>

        <FormFooter theme={theme} submitLabel="Salvar treinamento" onCancel={onClose} onDelete={editingId ? handleDelete : undefined} />
      </form>
    </Modal>
  );
}
