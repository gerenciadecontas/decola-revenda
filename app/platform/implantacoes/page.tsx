'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const COLORS = {
  purple: '#8B5CF6',
  yellow: '#FFC93C',
  green: '#34D399',
  red: '#F87171',
  blue: '#60A5FA',
  pink: '#EC4899',
  indigo: '#A78BFA',
  darkBg: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
  textTertiary: '#6B7280',
};

interface Implantacao {
  id: string;
  revenda: string;
  etapa: string;
  progresso: number;
  dataPrevista: string;
  status: 'em-andamento' | 'concluida' | 'pausado' | 'abandonado';
}

const revendas = [
  'Auto Nova Peças',
  'MGX Automação',
  'TecCampo',
  'Elétrica Pro',
  'Nova Rota Distribuição',
  'Força Distribuidora',
];

const etapas = [
  { value: 'chegada', label: 'CHEGADA', color: COLORS.blue },
  { value: 'boas-vindas', label: 'BOAS VINDAS', color: COLORS.blue },
  { value: 'sem-retorno', label: 'SEM RETORNO', color: COLORS.red },
  { value: 'apresentacao-desktop', label: 'APRESENTAÇÃO E INSTALAÇÃO LC DESKTOP', color: COLORS.purple },
  { value: 'apresentacao-web', label: 'APRESENTAÇÃO E INSTALAÇÃO DO LC WEB', color: COLORS.purple },
  { value: 'lc-academy', label: 'LC ACADEMY', color: COLORS.indigo },
  { value: 'acompanhamento', label: 'ACOMPANHAMENTO DOS CLIENTES INICIAIS', color: COLORS.pink },
  { value: 'decola-produtos', label: 'DECOLA PRODUTOS', color: COLORS.purple },
  { value: 'ativou-3', label: 'ATIVOU 3 CLIENTES', color: COLORS.green },
  { value: 'pausado', label: 'PAUSADO', color: COLORS.yellow },
  { value: 'abandonado', label: 'ABANDONADO', color: COLORS.red },
];

export default function ImplantacoesPage() {
  const [implantacoes, setImplantacoes] = useState<Implantacao[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEtapa, setSelectedEtapa] = useState<string>('chegada');
  const [formData, setFormData] = useState<{
    revenda: string;
    etapa: string;
    progresso: number;
    dataPrevista: string;
  }>({
    revenda: '',
    etapa: 'chegada',
    progresso: 0,
    dataPrevista: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('implantacoes-list');
    if (saved) {
      setImplantacoes(JSON.parse(saved));
    }
  }, []);

  const saveImplantacoes = (data: Implantacao[]) => {
    setImplantacoes(data);
    localStorage.setItem('implantacoes-list', JSON.stringify(data));
  };

  const handleAddImplantacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.revenda) return;

    const newImplantacao: Implantacao = {
      id: Date.now().toString(),
      revenda: formData.revenda,
      etapa: formData.etapa,
      progresso: formData.progresso,
      dataPrevista: formData.dataPrevista,
      status: formData.etapa === 'pausado' ? 'pausado' : formData.etapa === 'abandonado' ? 'abandonado' : 'em-andamento',
    };

    saveImplantacoes([...implantacoes, newImplantacao]);
    setFormData({ revenda: '', etapa: 'chegada', progresso: 0, dataPrevista: '' });
  };

  const handleUpdateProgress = (id: string, newProgress: number) => {
    saveImplantacoes(
      implantacoes.map(i =>
        i.id === id ? { ...i, progresso: newProgress } : i
      )
    );
  };

  const handleMoveToEtapa = (id: string, newEtapa: string) => {
    saveImplantacoes(
      implantacoes.map(i => {
        if (i.id === id) {
          const newStatus = newEtapa === 'pausado' ? 'pausado' : newEtapa === 'abandonado' ? 'abandonado' : 'em-andamento';
          return { ...i, etapa: newEtapa, status: newStatus };
        }
        return i;
      })
    );
  };

  const handleDelete = (id: string) => {
    saveImplantacoes(implantacoes.filter(i => i.id !== id));
  };

  return (
    <PlatformLayout currentPage="implantacoes">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', height: '100%' }}>
        {/* Kanban Board */}
        <div style={{ overflowX: 'auto', paddingBottom: '20px', height: '100%' }}>
          <div style={{ display: 'flex', gap: '16px', minWidth: 'fit-content', height: '100%' }}>
            {etapas.map(etapa => {
              const implantacoesEtapa = implantacoes.filter(i => i.etapa === etapa.value);

              return (
                <div
                  key={etapa.value}
                  style={{
                    flex: '0 0 280px',
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${COLORS.borderColor}`,
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '500px',
                  }}
                >
                  {/* Cabeçalho da coluna */}
                  <div
                    style={{
                      padding: '10px 12px',
                      background: etapa.color,
                      borderRadius: '10px',
                      marginBottom: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.2 }}>
                      {etapa.label}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                      {implantacoesEtapa.length}
                    </div>
                  </div>

                  {/* Botão + */}
                  <button
                    onClick={() => {
                      setSelectedEtapa(etapa.value);
                      setFormData({ ...formData, etapa: etapa.value });
                      setShowForm(true);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: `1px solid ${COLORS.borderColor}`,
                      color: COLORS.textSecondary,
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '20px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginBottom: '12px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.color = COLORS.textPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = COLORS.textSecondary;
                    }}
                  >
                    +
                  </button>

                  {/* Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                    {implantacoesEtapa.map(impl => (
                      <div
                        key={impl.id}
                        style={{
                          background: 'rgba(139, 92, 246, 0.1)',
                          border: `1px solid ${COLORS.borderColor}`,
                          borderRadius: '10px',
                          padding: '12px',
                          position: 'relative',
                        }}
                      >
                        <button
                          onClick={() => handleDelete(impl.id)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: COLORS.textSecondary,
                            cursor: 'pointer',
                            padding: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <X size={14} />
                        </button>

                        <div style={{ paddingRight: '20px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '6px' }}>
                            {impl.revenda}
                          </div>
                          {impl.dataPrevista && (
                            <div style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '8px' }}>
                              {new Date(impl.dataPrevista).toLocaleDateString('pt-BR')}
                            </div>
                          )}

                          {impl.progresso > 0 && (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '10px', color: COLORS.textSecondary }}>Progresso</span>
                                <span style={{ fontSize: '10px', fontWeight: 600, color: COLORS.textPrimary }}>{impl.progresso}%</span>
                              </div>
                              <div style={{ height: '4px', borderRadius: '4px', background: COLORS.borderColor, overflow: 'hidden' }}>
                                <div style={{ height: '100%', borderRadius: '4px', width: `${impl.progresso}%`, background: impl.progresso === 100 ? COLORS.green : COLORS.yellow }} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Botão próxima etapa */}
                        {etapa.value !== 'abandonado' && etapa.value !== 'pausado' && (
                          <div style={{ marginTop: '8px' }}>
                            <button
                              onClick={() => {
                                const currentIndex = etapas.findIndex(e => e.value === etapa.value);
                                if (currentIndex < etapas.length - 1) {
                                  handleMoveToEtapa(impl.id, etapas[currentIndex + 1].value);
                                }
                              }}
                              style={{
                                width: '100%',
                                padding: '6px',
                                background: 'rgba(139, 92, 246, 0.2)',
                                border: 'none',
                                borderRadius: '6px',
                                color: COLORS.purple,
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              → Próxima
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal */}
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
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.borderColor}`,
                borderRadius: '18px',
                padding: '24px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: COLORS.textPrimary, margin: 0 }}>
                  Adicionar Nova Implantação
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: COLORS.textSecondary,
                    cursor: 'pointer',
                    fontSize: '24px',
                    padding: '0',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => { handleAddImplantacao(e); setShowForm(false); }} style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                    Revenda *
                  </label>
                  <select
                    value={formData.revenda}
                    onChange={(e) => setFormData({ ...formData, revenda: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${COLORS.borderColor}`,
                      borderRadius: '8px',
                      color: COLORS.textPrimary,
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
                  <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                    Etapa Atual *
                  </label>
                  <select
                    value={formData.etapa}
                    onChange={(e) => setFormData({ ...formData, etapa: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${COLORS.borderColor}`,
                      borderRadius: '8px',
                      color: COLORS.textPrimary,
                      fontSize: '13px',
                      fontFamily: 'inherit',
                    }}
                  >
                    {etapas.map(e => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                    Data Prevista
                  </label>
                  <input
                    type="date"
                    value={formData.dataPrevista}
                    onChange={(e) => setFormData({ ...formData, dataPrevista: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${COLORS.borderColor}`,
                      borderRadius: '8px',
                      color: COLORS.textPrimary,
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
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
                      accentColor: COLORS.green,
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: 'transparent',
                      color: COLORS.textSecondary,
                      border: `1px solid ${COLORS.borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: COLORS.purple,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
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
