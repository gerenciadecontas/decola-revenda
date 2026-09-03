'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';
import { useState, useEffect } from 'react';
import { useSupabaseTable } from '@/lib/supabase/hooks';
import '@/app/globals.css';
import './styles.css';

interface Implantacao {
  id?: string;
  revenda_id?: string;
  revenda?: string;
  etapa: string;
  progresso: number;
  data_prevista?: string;
  status: 'em-andamento' | 'concluida' | 'pausado' | 'abandonado';
  created_at?: string;
  updated_at?: string;
}

const revendas = [
  'Distribuidora Aurora',
  'Mercado Bom Preço',
  'Casa & Cia Materiais',
  'Padaria Trigo Dourado',
  'Papelaria Central',
  'Tech Supply ME',
];

const STAGES = [
  { id: 'chegada', nome: 'Chegada', c: '#E6B23E' },
  { id: 'boas-vindas', nome: 'Boas-vindas', c: '#C99526' },
  { id: 'sem-retorno', nome: 'Sem retorno', c: '#D9534F' },
  { id: 'apresentacao-desktop', nome: 'Apresentação e instalação', c: '#7C5CF0' },
  { id: 'apresentacao-web', nome: 'Web', c: '#5B43C0' },
  { id: 'lc-academy', nome: 'LC Academy', c: '#8B9099' },
  { id: 'acompanhamento', nome: 'Acompanhamento', c: '#4E8E5B' },
  { id: 'decola-produtos', nome: 'Produtos', c: '#7C5CF0' },
  { id: 'ativou-3', nome: 'Go-Live', c: '#4E8E5B' },
  { id: 'pausado', nome: 'Pausado', c: '#E6B23E' },
  { id: 'abandonado', nome: 'Abandono', c: '#D9534F' },
];

const tagCls = (t: string) => {
  if (/Prioridade|tentativas/.test(t)) return 'b-red';
  if (/Novo|Reunião|Instalando|Integração/.test(t)) return 'b-yellow';
  if (/Treinando/.test(t)) return 'b-purple';
  return 'b-gray';
};

const ini = (s: string) => {
  const p = s.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase();
};

export default function ImplantacoesPage() {
  // @ts-ignore
  const { data: implantacoes = [], create, update: updateRecord, delete_: deleteRecord } = useSupabaseTable<Implantacao>('implantacoes');
  const [showForm, setShowForm] = useState(false);
  const [q, setQ] = useState('');
  const [dragRev, setDragRev] = useState<string | null>(null);
  const [isLight, setIsLight] = useState(false);
  const [formData, setFormData] = useState<{
    revenda: string;
    progresso: number;
    data_prevista: string;
  }>({
    revenda: '',
    progresso: 0,
    data_prevista: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('implantacoes-theme');
    if (saved === 'light') {
      setIsLight(true);
      document.body.classList.add('light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('implantacoes-theme', isLight ? 'light' : 'dark');
    if (isLight) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [isLight]);

  const match = (c: Implantacao) => {
    const s = q.toLowerCase();
    return !s || c.revenda?.toLowerCase().includes(s);
  };

  const vis = implantacoes.filter(match);

  const handleAddImplantacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.revenda) return;

    await create({
      revenda: formData.revenda,
      etapa: 'chegada',
      progresso: formData.progresso,
      data_prevista: formData.data_prevista || undefined,
      status: 'em-andamento',
    });
    setFormData({ revenda: '', progresso: 0, data_prevista: '' });
    setShowForm(false);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    await deleteRecord(id);
  };

  const handleDragStart = (rev: string) => {
    setDragRev(rev);
  };

  const handleDragEnd = () => {
    setDragRev(null);
  };

  const handleDrop = async (stageId: string) => {
    if (!dragRev) return;
    const c = implantacoes.find(x => x.revenda === dragRev);
    if (c && c.id && c.etapa !== stageId) {
      await updateRecord(c.id, { ...c, etapa: stageId });
    }
    setDragRev(null);
  };

  const renderCard = (c: Implantacao, stage: typeof STAGES[0]) => {
    return (
      <div
        key={c.id}
        className="kcard"
        draggable
        onDragStart={() => handleDragStart(c.revenda || '')}
        onDragEnd={handleDragEnd}
        style={{
          opacity: dragRev === c.revenda ? 0.4 : 1,
        }}
      >
        <div className="kcard-top">
          <div
            className="avatar av-36"
            style={{
              background: `linear-gradient(135deg, #3A3D46, #26282E)`,
            }}
          >
            {ini(c.revenda || '')}
          </div>
          <div className="kmeta">
            <b>{c.revenda}</b>
            <span>{c.revenda || ''}</span>
          </div>
        </div>

        <div className="ktags">
          <span className="badge b-yellow">Novo</span>
        </div>

        <div className="kprog">
          <span>Progresso</span>
          <span className="kp">{c.progresso}%</span>
        </div>

        <div className="track">
          <i
            style={{
              width: `${c.progresso}%`,
              background: `linear-gradient(90deg, #FFD873, #E6B23E)`,
            }}
          />
        </div>

        <div className="kfoot">
          <span>⏱ {Math.floor(Math.random() * 10) + 1}d nesta etapa</span>
          <span className="owner">👤 Melissa</span>
          <button
            onClick={() => handleDelete(c.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#E08585',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: 'auto',
            }}
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  const ativas = implantacoes.filter(i => i.status === 'em-andamento').length;
  const emRisco = implantacoes.filter(i => i.status === 'em-andamento' && i.etapa === 'sem-retorno').length;
  const concluidas = implantacoes.filter(i => i.status === 'concluida').length;

  return (
    <PlatformLayout currentPage="implantacoes">
      <div style={{ padding: '24px' }}>
        <div className="page-lead">
          <h2>Implantações</h2>
          <p>Pipeline de onboarding por etapa · {ativas} revendas em curso.</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '18px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--ink-2)', margin: '0 0 8px 0' }}>Implantações ativas</p>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ink)' }}>{ativas}</div>
            <p style={{ fontSize: '12px', color: 'var(--ink-2)', margin: '8px 0 0 0' }}>entraram esta semana</p>
          </div>

          <div style={{ background: 'rgba(230, 178, 62, 0.1)', border: '1px solid #E6B23E', borderRadius: '18px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--ink-2)', margin: '0 0 8px 0' }}>Sem retorno</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#E6B23E' }}>{emRisco}</div>
              <span style={{ fontSize: '11px', background: '#E6B23E', color: '#0E1013', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>risco</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-2)', margin: '8px 0 0 0' }}>paradas há 5+ dias</p>
          </div>

          <div style={{ background: 'rgba(123, 92, 240, 0.08)', border: '1px solid #5B43C0', borderRadius: '18px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--ink-2)', margin: '0 0 8px 0' }}>Tempo médio na etapa</p>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#8B7CF6' }}>5d</div>
            <p style={{ fontSize: '12px', color: 'var(--ink-2)', margin: '8px 0 0 0' }}>meta: 4 dias</p>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '18px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--ink-2)', margin: '0 0 8px 0' }}>Concluídas no mês</p>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ink)' }}>{concluidas}</div>
            <p style={{ fontSize: '12px', color: 'var(--ink-2)', margin: '8px 0 0 0' }}>taxa de go-live</p>
          </div>
        </div>

        <div className="filterbar">
          <span className="flabel">🔍 Filtros</span>
          <div className="finput">
            <input
              id="kq"
              placeholder="Buscar revenda, responsável ou agente..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button
            className="btn btn-ghost btn-sm"
            id="clearBtn"
            onClick={() => setQ('')}
            style={{ display: q ? 'inline-flex' : 'none' }}
          >
            Limpar
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(true)}
          >
            + Nova implantação
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setIsLight(!isLight)}
            title={isLight ? 'Escuro' : 'Claro'}
          >
            {isLight ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="stages" id="stages">
          {STAGES.map((s, i) => {
            const n = vis.filter(c => c.etapa === s.id).length;
            return (
              <button
                key={s.id}
                className={`stage-tab${i === 0 ? ' active' : ''}`}
                data-stage={s.id}
                onClick={() => {
                  document
                    .querySelectorAll('.stage-tab')
                    .forEach(x => x.classList.remove('active'));
                  (event?.target as HTMLElement)?.classList.add('active');
                }}
              >
                <span className="sdot" style={{ background: s.c }} />
                {s.nome}
                <span className="scount">{n}</span>
              </button>
            );
          })}
        </div>

        <div className="board" id="board">
          {STAGES.map(s => {
            const list = vis.filter(c => c.etapa === s.id);

            return (
              <section
                key={s.id}
                className="col"
                data-stage={s.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  (e.currentTarget as HTMLElement).classList.add('over');
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    (e.currentTarget as HTMLElement).classList.remove('over');
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  (e.currentTarget as HTMLElement).classList.remove('over');
                  handleDrop(s.id);
                }}
              >
                <div className="col-head">
                  <span className="sdot" style={{ background: s.c }} />
                  <b>{s.nome}</b>
                  <span className="scount">{list.length}</span>
                </div>

                <div className="col-body">
                  {list.length > 0 ? (
                    list.map((c) => renderCard(c, s))
                  ) : (
                    <div className="col-empty">
                      <div className="ce-ic">📭</div>
                      <b>Nenhuma implantação</b>
                      <p>Arraste um card para cá</p>
                    </div>
                  )}
                </div>

                {s.id === 'chegada' && (
                  <button
                    className="addcard"
                    onClick={() => setShowForm(true)}
                  >
                    + Adicionar revenda
                  </button>
                )}
              </section>
            );
          })}
        </div>

        {showForm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowForm(false)}
          >
            <div
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderRadius: '18px',
                padding: '24px',
                maxWidth: '500px',
                width: '90%',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                  Nova Implantação
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--ink-2)',
                    cursor: 'pointer',
                    fontSize: '24px',
                    padding: '0',
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddImplantacao} style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: '6px' }}>
                    Revenda *
                  </label>
                  <select
                    value={formData.revenda}
                    onChange={(e) => setFormData({ ...formData, revenda: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--panel-2)',
                      border: '1px solid var(--line)',
                      borderRadius: '8px',
                      color: 'var(--ink)',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="">Selecione uma revenda</option>
                    {revendas.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: '6px' }}>
                    Progresso: {formData.progresso}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progresso}
                    onChange={(e) => setFormData({ ...formData, progresso: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      accentColor: '#E6B23E',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-ghost btn-sm"
                    style={{ flex: 1 }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Adicionar
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
