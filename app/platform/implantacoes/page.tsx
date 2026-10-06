'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';
import { useTheme } from '@/app/context/ThemeContext';
import { useState, useEffect } from 'react';
import { useLocalTable } from '@/lib/supabase/hooks';
import '@/app/globals.css';
import './styles.css';
import { STAGES, PRIORIDADES, PRODUTOS, daysSince, type Implantacao, type Prioridade, type Status } from './data';

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

const SITUACOES = ['🆕 Nova Revenda', '🚀 Em implantação', '✅ Ativa', '⏸️ Pausada', '❌ Cancelada'];

const SEGMENTOS = ['Varejo', 'Atacado / Distribuição', 'Materiais de construção', 'Alimentação', 'Serviços', 'Indústria', 'Outros'];

const PORTES = ['MEI', 'Microempresa', 'Pequena', 'Média', 'Grande'];

const onlyDigits = (v: string) => v.replace(/\D/g, '');

const maskCNPJ = (v: string) =>
  onlyDigits(v)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');

const maskPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};


const DROP_ZONES: Record<string, { icon: string; label: string; hint: string }> = {
  'ativou-3': { icon: '📦', label: 'Concluir', hint: 'Solte aqui para concluir a implantação' },
  abandonado: { icon: '🚫', label: 'Cancelar', hint: 'Solte aqui para marcar como abandono' },
};


const statusFor = (etapa: string): Status => {
  if (etapa === 'ativou-3') return 'concluida';
  if (etapa === 'pausado') return 'pausado';
  if (etapa === 'abandonado') return 'abandonado';
  return 'em-andamento';
};


const ini = (s: string) => {
  const p = s.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase();
};

const LIGHT_THEME = {
  background: '#F9F7F4',
  cardBg: '#FFFFFF',
  borderColor: '#E8E4DC',
  inputBg: '#F9F7F4',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#A0A0A0',
};

const DARK_THEME = {
  background: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#2A2D33',
  inputBg: '#0E1013',
  textPrimary: '#F5F5F5',
  textSecondary: '#B8BFCC',
  textTertiary: '#7A8290',
};

type FormState = {
  codigo: string;
  revenda: string;
  cnpj: string;
  cidade: string;
  uf: string;
  email: string;
  telefone: string;
  contato: string;
  cargo: string;
  situacao: string;
  segmento: string;
  porte: string;
  vendedores: string;
  data_ingresso: string;
  data_aniversario: string;
  contratos: string;
  curva: string;
  etapa: string;
  prioridade: Prioridade;
  produto: string;
  responsavel: string;
  data_prevista: string;
  observacoes: string;
};

const emptyForm = (etapa = 'chegada'): FormState => ({
  codigo: '',
  revenda: '',
  cnpj: '',
  cidade: '',
  uf: '',
  email: '',
  telefone: '',
  contato: '',
  cargo: '',
  situacao: SITUACOES[0],
  segmento: '',
  porte: '',
  vendedores: '',
  data_ingresso: todayISO(),
  data_aniversario: '',
  contratos: '',
  curva: '',
  etapa,
  prioridade: 'normal',
  produto: PRODUTOS[0],
  responsavel: '',
  data_prevista: '',
  observacoes: '',
});

export default function ImplantacoesPage() {
  const { isDark } = useTheme();
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  const { data: implantacoes, create, update, delete_ } = useLocalTable<Implantacao>('implantacoes');

  const [qNome, setQNome] = useState('');
  const [qCodigo, setQCodigo] = useState('');
  const [fPrioridade, setFPrioridade] = useState<'' | Prioridade>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [formError, setFormError] = useState('');

  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
  }, [isDark]);

  const vis = implantacoes.filter(c => {
    if (qNome && !c.revenda.toLowerCase().includes(qNome.toLowerCase())) return false;
    if (qCodigo && !(c.codigo || '').toLowerCase().includes(qCodigo.toLowerCase())) return false;
    if (fPrioridade && c.prioridade !== fPrioridade) return false;
    return true;
  });

  const openNew = (etapa: string) => {
    setEditingId(null);
    setForm(emptyForm(etapa));
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c: Implantacao) => {
    setEditingId(c.id || null);
    setForm({
      codigo: c.codigo || '',
      revenda: c.revenda,
      cnpj: c.cnpj || '',
      cidade: c.cidade || '',
      uf: c.uf || '',
      email: c.email || '',
      telefone: c.telefone || '',
      contato: c.contato || '',
      cargo: c.cargo || '',
      situacao: c.situacao || SITUACOES[0],
      segmento: c.segmento || '',
      porte: c.porte || '',
      vendedores: c.vendedores != null ? String(c.vendedores) : '',
      data_ingresso: c.data_ingresso || '',
      data_aniversario: c.data_aniversario || '',
      contratos: c.contratos != null ? String(c.contratos) : '',
      curva: c.curva || '',
      etapa: c.etapa,
      prioridade: c.prioridade || 'normal',
      produto: c.produto || PRODUTOS[0],
      responsavel: c.responsavel || '',
      data_prevista: c.data_prevista || '',
      observacoes: c.observacoes || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const revenda = form.revenda.trim();
    const codigo = form.codigo.trim();
    const cidade = form.cidade.trim();
    const email = form.email.trim();
    const cnpjDigits = onlyDigits(form.cnpj);

    if (!revenda) return setFormError('Informe o nome da revenda.');
    if (!cidade) return setFormError('Informe a cidade.');
    if (!form.uf) return setFormError('Selecione a UF.');
    if (!form.situacao) return setFormError('Selecione o status da revenda.');
    if (cnpjDigits && cnpjDigits.length !== 14) return setFormError('O CNPJ precisa ter 14 dígitos.');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setFormError('Informe um e-mail válido.');
    if (form.telefone && ![10, 11].includes(onlyDigits(form.telefone).length)) return setFormError('Informe um telefone com DDD.');
    if (cnpjDigits && implantacoes.some(i => i.id !== editingId && onlyDigits(i.cnpj || '') === cnpjDigits)) {
      return setFormError('Já existe uma revenda cadastrada com esse CNPJ.');
    }

    const ativas = implantacoes.filter(i => i.id !== editingId && i.status !== 'concluida' && i.status !== 'abandonado');
    const dupNome = ativas.find(i => i.revenda.toLowerCase() === revenda.toLowerCase());
    if (dupNome) {
      setFormError(`"${revenda}" já está em implantação na etapa "${STAGES.find(s => s.id === dupNome.etapa)?.nome}".`);
      return;
    }
    if (codigo && ativas.some(i => (i.codigo || '').toLowerCase() === codigo.toLowerCase())) {
      setFormError(`O código ${codigo} já está em uso por outra implantação.`);
      return;
    }

    const payload = {
      ...form,
      revenda,
      codigo,
      cidade,
      email,
      vendedores: form.vendedores === '' ? undefined : Math.max(0, Number(form.vendedores)),
      contratos: form.contratos === '' ? undefined : Math.max(0, Number(form.contratos)),
      curva: form.curva.trim().toUpperCase(),
    };

    if (editingId) {
      const atual = implantacoes.find(i => i.id === editingId);
      const mudouEtapa = atual && atual.etapa !== form.etapa;
      await update(editingId, {
        ...payload,
        status: statusFor(form.etapa),
        ...(mudouEtapa ? { etapa_desde: new Date().toISOString() } : {}),
      });
    } else {
      await create({ ...payload, status: statusFor(form.etapa), etapa_desde: new Date().toISOString() });
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!window.confirm(`Excluir a implantação de "${form.revenda}"? Essa ação não pode ser desfeita.`)) return;
    await delete_(editingId);
    setModalOpen(false);
  };

  const moveTo = async (id: string, etapa: string) => {
    const c = implantacoes.find(i => i.id === id);
    if (!c || c.etapa === etapa) return;
    await update(id, { etapa, status: statusFor(etapa), etapa_desde: new Date().toISOString() });
  };

  const renderCard = (c: Implantacao) => {
    const prio = PRIORIDADES[c.prioridade] || PRIORIDADES.normal;
    const dias = daysSince(c.etapa_desde || c.created_at);
    const parada = c.status === 'em-andamento' && dias >= 5;

    return (
      <div
        key={c.id}
        className={`kcard${dragId === c.id ? ' dragging' : ''}`}
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('text/plain', c.id || '');
          e.dataTransfer.effectAllowed = 'move';
          setDragId(c.id || null);
        }}
        onDragEnd={() => {
          setDragId(null);
          setOverStage(null);
        }}
        onClick={() => openEdit(c)}
        style={{ background: theme.cardBg, borderColor: theme.borderColor, color: theme.textPrimary }}
        title="Clique para ver detalhes ou arraste para outra etapa"
      >
        <div className="kcard-top">
          <div className="avatar av-36" style={{ background: 'linear-gradient(135deg, #3A3D46, #26282E)' }}>
            {ini(c.revenda)}
          </div>
          <div className="kmeta">
            <b style={{ color: theme.textPrimary }}>
              {c.codigo ? `${c.codigo} · ` : ''}
              {c.revenda}
            </b>
            <span>
              {[c.cidade && c.uf ? `${c.cidade}/${c.uf}` : '', c.responsavel ? `👤 ${c.responsavel}` : ''].filter(Boolean).join(' · ') || 'Sem responsável'}
            </span>
          </div>
        </div>

        <div className="ktags">
          <span className="badge" style={{ background: `${prio.c}22`, color: prio.c }}>{prio.label}</span>
          <span className="badge" style={{ background: theme.borderColor, color: theme.textSecondary }}>{c.produto}</span>
        </div>

        <div className="kfoot" style={{ borderTopColor: theme.borderColor }}>
          <span className={parada ? 'late' : ''}>
            ⏱ {dias === 0 ? 'Hoje nesta etapa' : `${dias} dia${dias > 1 ? 's' : ''} nesta etapa`}
          </span>
          {c.data_prevista && (
            <span className="owner">📅 {new Date(`${c.data_prevista}T00:00:00`).toLocaleDateString('pt-BR')}</span>
          )}
        </div>
      </div>
    );
  };

  const ativas = implantacoes.filter(i => i.status === 'em-andamento').length;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: theme.inputBg,
    border: `1px solid ${theme.borderColor}`,
    borderRadius: '10px',
    color: theme.textPrimary,
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: theme.textSecondary,
    display: 'block',
    marginBottom: '6px',
  };

  const sectionStyle: React.CSSProperties = {
    gridColumn: '1 / -1',
    margin: '8px 0 0',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: theme.textTertiary,
  };

  const setField = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const filtrosAtivos = qNome || qCodigo || fPrioridade;

  return (
    <PlatformLayout currentPage="implantacoes">
      <div style={{ padding: '24px', background: theme.background, minHeight: '100vh' }}>
        <div className="page-lead" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div>
            <h2 style={{ color: theme.textPrimary }}>Implantações</h2>
            <p>Pipeline de onboarding por etapa · {ativas} revendas em curso.</p>
          </div>
          <button
            onClick={() => openNew('chegada')}
            style={{ padding: '11px 18px', background: '#E6B23E', border: 'none', borderRadius: '12px', color: '#1A1A1A', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            + Nova Revenda
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input
            placeholder="Pesquisar por revenda..."
            value={qNome}
            onChange={e => setQNome(e.target.value)}
            style={{ ...inputStyle, background: theme.cardBg, flex: '1 1 220px', width: 'auto' }}
          />
          <input
            placeholder="Pesquisar por código..."
            value={qCodigo}
            onChange={e => setQCodigo(e.target.value)}
            style={{ ...inputStyle, background: theme.cardBg, flex: '0 1 200px', width: 'auto' }}
          />
          <select
            value={fPrioridade}
            onChange={e => setFPrioridade(e.target.value as '' | Prioridade)}
            style={{ ...inputStyle, background: theme.cardBg, flex: '0 1 180px', width: 'auto' }}
          >
            <option value="">Todas as prioridades</option>
            {Object.entries(PRIORIDADES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          {filtrosAtivos && (
            <button
              onClick={() => {
                setQNome('');
                setQCodigo('');
                setFPrioridade('');
              }}
              style={{ background: 'transparent', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}
            >
              Limpar filtros
            </button>
          )}
        </div>

        <div className="board" id="board">
          {STAGES.map(s => {
            const list = vis.filter(c => c.etapa === s.id);
            const zone = DROP_ZONES[s.id];
            const isOver = overStage === s.id;

            return (
              <section
                key={s.id}
                className={`col${isOver ? ' over' : ''}`}
                style={isOver ? undefined : { background: theme.cardBg, borderColor: theme.borderColor, color: theme.textPrimary }}
                onDragOver={e => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (overStage !== s.id) setOverStage(s.id);
                }}
                onDragLeave={e => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverStage(null);
                }}
                onDrop={e => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('text/plain') || dragId;
                  setOverStage(null);
                  setDragId(null);
                  if (id) moveTo(id, s.id);
                }}
              >
                <div className="col-head">
                  <span className="sdot" style={{ background: s.c }} />
                  <b style={{ color: theme.textPrimary }}>{s.nome}</b>
                  <span className="scount" style={{ background: theme.borderColor, color: theme.textSecondary }}>{list.length}</span>
                </div>

                {!zone && (
                  <button className="addcard" style={{ marginTop: 0, marginBottom: '12px' }} onClick={() => openNew(s.id)}>
                    + Adicionar
                  </button>
                )}

                <div className="col-body">
                  {list.map(c => renderCard(c))}

                  {list.length === 0 && zone && (
                    <div className="col-empty" style={{ color: theme.textSecondary, padding: '48px 12px' }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>{zone.icon}</div>
                      <b style={{ color: theme.textPrimary, fontSize: '16px' }}>{zone.label}</b>
                      <p>{zone.hint}</p>
                    </div>
                  )}

                  {list.length === 0 && !zone && (
                    <div className="col-empty" style={{ color: theme.textSecondary }}>
                      <div className="ce-ic" style={{ background: theme.borderColor, color: theme.textTertiary }}>📭</div>
                      <b style={{ color: theme.textSecondary }}>Nenhuma implantação</b>
                      <p>Arraste um card para cá</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {modalOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}
            onClick={closeModal}
          >
            <div
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: '18px',
                maxWidth: '640px',
                width: '100%',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${theme.borderColor}` }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
                  {editingId ? 'Detalhes da revenda' : 'Nova Revenda'}
                </h2>
                <button
                  onClick={closeModal}
                  style={{ background: 'transparent', border: `1px solid ${theme.borderColor}`, borderRadius: '8px', width: '32px', height: '32px', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px', padding: '20px 24px', overflowY: 'auto' }}>
                  <p style={{ ...sectionStyle, marginTop: 0 }}>Dados da revenda</p>

                  <div>
                    <label style={labelStyle}>Nome da Revenda *</label>
                    <input value={form.revenda} onChange={setField('revenda')} placeholder="Ex: TechSol Soluções LTDA" style={inputStyle} autoFocus />
                  </div>
                  <div>
                    <label style={labelStyle}>CNPJ</label>
                    <input value={form.cnpj} onChange={e => setForm({ ...form, cnpj: maskCNPJ(e.target.value) })} placeholder="00.000.000/0001-00" inputMode="numeric" style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Cidade *</label>
                    <input value={form.cidade} onChange={setField('cidade')} placeholder="São Paulo" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>UF *</label>
                    <select value={form.uf} onChange={setField('uf')} style={inputStyle}>
                      <option value="">Selecione</option>
                      {UFS.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>E-mail</label>
                    <input type="email" value={form.email} onChange={setField('email')} placeholder="contato@empresa.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Telefone</label>
                    <input value={form.telefone} onChange={e => setForm({ ...form, telefone: maskPhone(e.target.value) })} placeholder="(11) 99999-9999" inputMode="tel" style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Responsável da Revenda</label>
                    <input value={form.contato} onChange={setField('contato')} placeholder="Nome do responsável na empresa cliente" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Status *</label>
                    <select value={form.situacao} onChange={setField('situacao')} style={inputStyle}>
                      {SITUACOES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Cargo</label>
                    <input value={form.cargo} onChange={setField('cargo')} placeholder="Ex: Diretor, Gerente, Sócio..." style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Código</label>
                    <input value={form.codigo} onChange={setField('codigo')} placeholder="Ex: 40924" style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Segmento</label>
                    <select value={form.segmento} onChange={setField('segmento')} style={inputStyle}>
                      <option value="">Selecione</option>
                      {SEGMENTOS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Porte</label>
                    <select value={form.porte} onChange={setField('porte')} style={inputStyle}>
                      <option value="">Selecione</option>
                      {PORTES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Nº de Vendedores</label>
                    <input type="number" min={0} value={form.vendedores} onChange={setField('vendedores')} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Data de Ingresso</label>
                    <input type="date" value={form.data_ingresso} onChange={setField('data_ingresso')} style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Qtd. Contratos</label>
                    <input type="number" min={0} value={form.contratos} onChange={setField('contratos')} placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Curva</label>
                    <input value={form.curva} onChange={setField('curva')} placeholder="Ex: A, B, C" maxLength={2} style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Data de Aniversário</label>
                    <input type="date" value={form.data_aniversario} onChange={setField('data_aniversario')} style={inputStyle} />
                  </div>
                  <div />

                  <p style={sectionStyle}>Implantação</p>

                  <div>
                    <label style={labelStyle}>Etapa</label>
                    <select value={form.etapa} onChange={setField('etapa')} style={inputStyle}>
                      {STAGES.map(s => (
                        <option key={s.id} value={s.id}>{s.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Prioridade</label>
                    <select value={form.prioridade} onChange={setField('prioridade')} style={inputStyle}>
                      {Object.entries(PRIORIDADES).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Produto</label>
                    <select value={form.produto} onChange={setField('produto')} style={inputStyle}>
                      {PRODUTOS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Responsável interno</label>
                    <input value={form.responsavel} onChange={setField('responsavel')} placeholder="Quem acompanha a implantação" style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Data prevista de go-live</label>
                    <input type="date" value={form.data_prevista} onChange={setField('data_prevista')} style={inputStyle} />
                  </div>
                  <div />

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Observações</label>
                    <textarea
                      value={form.observacoes}
                      onChange={setField('observacoes')}
                      placeholder="Informações adicionais..."
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  {formError && (
                    <div style={{ gridColumn: '1 / -1', background: 'rgba(217, 83, 79, 0.12)', color: '#D9534F', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
                      {formError}
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
                    onClick={closeModal}
                    style={{ marginLeft: 'auto', padding: '10px 18px', background: 'transparent', border: `1px solid ${theme.borderColor}`, borderRadius: '10px', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 18px', background: '#E6B23E', border: 'none', borderRadius: '10px', color: '#1A1A1A', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit' }}
                  >
                    Salvar Revenda
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
