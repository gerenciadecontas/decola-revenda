'use client';

import { GestorLayout } from '@/app/components/GestorLayout';
import { useTheme } from '@/app/context/ThemeContext';
import { useState, useRef } from 'react';

interface Revenda {
  id: string;
  nome: string;
  sigla: string;
  etapa: 'chegada' | 'boas-vindas' | 'sem-retorno' | 'apresentacao-desktop' | 'apresentacao-web' | 'lc-academy' | 'acompanhamento' | 'decola-produtos' | 'ativou-3' | 'pausado' | 'abandono';
  responsavel: string;
  progresso: number;
  status: string;
}

const ETAPAS = [
  { id: 'chegada', nome: 'Chegada', cor: '#FFA500' },
  { id: 'boas-vindas', nome: 'Boas-vindas', cor: '#8B5CF6' },
  { id: 'sem-retorno', nome: 'Sem retorno', cor: '#FF6B6B' },
  { id: 'apresentacao-desktop', nome: 'Apresentação e instalação LC Desktop', cor: '#3B82F6' },
  { id: 'apresentacao-web', nome: 'Apresentação e instalação do LC Web', cor: '#06B6D4' },
  { id: 'lc-academy', nome: 'LC Academy', cor: '#8B5CF6' },
  { id: 'acompanhamento', nome: 'Acompanhamento dos 3 clientes iniciais', cor: '#14B8A6' },
  { id: 'decola-produtos', nome: 'Decola Produtos', cor: '#F59E0B' },
  { id: 'ativou-3', nome: 'Ativou 3 clientes', cor: '#10B981' },
  { id: 'pausado', nome: 'Pausado', cor: '#F59E0B' },
  { id: 'abandono', nome: 'Abandono', cor: '#EF4444' },
];

const revendasData: Revenda[] = [];

export default function ImplantacoesPage() {
  const [revendas] = useState<Revenda[]>(revendasData);
  const [etapas, setEtapas] = useState(ETAPAS);
  const [showConfig, setShowConfig] = useState(false);
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [metaMes, setMetaMes] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('meta-implantacoes-mes');
      return saved ? parseInt(saved) : 10;
    }
    return 10;
  });
  const [tempMeta, setTempMeta] = useState(metaMes.toString());
  const { colors, isDark } = useTheme();
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  const handleScrollBar = () => {
    if (scrollBarRef.current && columnsRef.current) {
      columnsRef.current.scrollLeft = scrollBarRef.current.scrollLeft;
    }
  };

  const handleScrollColumns = () => {
    if (columnsRef.current && scrollBarRef.current) {
      scrollBarRef.current.scrollLeft = columnsRef.current.scrollLeft;
    }
  };

  const total = revendas.length;
  const ativas = revendas.filter(r => r.etapa !== 'abandono' && r.etapa !== 'pausado').length;
  const semRetorno = revendas.filter(r => r.etapa === 'sem-retorno').length;
  const ativou3 = revendas.filter(r => r.etapa === 'ativou-3').length;

  const handleDeleteEtapa = (id: string) => {
    setEtapas(etapas.filter(e => e.id !== id));
  };

  const handleAddEtapa = () => {
    const novaEtapa = {
      id: `etapa-${Date.now()}`,
      nome: 'Nova Etapa',
      cor: '#9CA3AF',
    };
    setEtapas([...etapas, novaEtapa]);
  };

  const handleSalvarMeta = () => {
    const novaMetaNum = parseInt(tempMeta);
    if (novaMetaNum > 0) {
      setMetaMes(novaMetaNum);
      localStorage.setItem('meta-implantacoes-mes', novaMetaNum.toString());
      setShowMetaModal(false);
    }
  };

  const getRevendasPorEtapa = (etapaId: string) => {
    return revendas.filter(r => r.etapa === etapaId);
  };

  const getCorEtapa = (etapaId: string) => {
    const etapa = ETAPAS.find(e => e.id === etapaId);
    return etapa?.cor || '#999';
  };

  return (
    <GestorLayout currentPage="implantacoes">
      <style>{`
        .pipeline-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .pipeline-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '1400px' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: 500 }}>
          Implantação / <span style={{ color: colors.textSecondary }}>Implantações</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 700, color: colors.textPrimary, margin: 0, marginBottom: '8px' }}>
              Implantações
            </h1>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
              {total} revendas em onboarding · atualizado há 2 min
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              style={{
                background: 'transparent',
                border: `1px solid ${colors.borderColor}`,
                color: colors.textPrimary,
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Exportar
            </button>
            <button
              onClick={() => setShowConfig(true)}
              style={{
                background: isDark ? '#2a2a2a' : '#f5f5f5',
                border: `1px solid ${colors.borderColor}`,
                color: colors.textPrimary,
                padding: '8px',
                borderRadius: '8px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
              }}
              title="Configurar etapas"
            >
              ⚙️
            </button>
            <button
              onClick={() => {
                setShowMetaModal(true);
                setTempMeta(metaMes.toString());
              }}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.borderColor}`,
                color: colors.textPrimary,
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Editar meta de implantações do mês"
            >
              📊 Meta: {metaMes}
            </button>
            <button
              style={{
                background: '#8B5CF6',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Nova revenda
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {/* Ativas */}
          <div style={{ background: colors.cardBackground, border: `1px solid ${colors.borderColor}`, borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px 0', fontWeight: 500 }}>Implantações ativas</p>
            <div style={{ fontSize: '36px', fontWeight: 700, color: colors.textPrimary, marginBottom: '8px' }}>{ativas}</div>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>+2 entraram esta semana</p>
          </div>

          {/* Sem retorno */}
          <div style={{ background: isDark ? 'rgba(255, 165, 0, 0.15)' : '#FFF8E6', border: isDark ? '1px solid rgba(255, 165, 0, 0.3)' : '1px solid #FFD580', borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: isDark ? '#FFA500' : '#8B6914', margin: '0 0 12px 0', fontWeight: 500 }}>Sem retorno</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#FFA500' }}>{semRetorno}</div>
              <span style={{ fontSize: '11px', background: '#FFA500', color: isDark ? '#000' : '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>risco</span>
            </div>
            <p style={{ fontSize: '12px', color: isDark ? '#FFA500' : '#8B6914', margin: '8px 0 0 0' }}>paradas há 5+ dias</p>
          </div>

          {/* Tempo médio */}
          <div style={{ background: isDark ? 'rgba(139, 92, 246, 0.1)' : '#F3E8FF', border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid #E9D5FF', borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: isDark ? '#B7A8E6' : '#6B4C9A', margin: '0 0 12px 0', fontWeight: 500 }}>Tempo médio na etapa</p>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#8B5CF6', marginBottom: '8px' }}>5d</div>
            <p style={{ fontSize: '12px', color: isDark ? '#B7A8E6' : '#6B4C9A', margin: 0 }}>meta: 4 dias</p>
          </div>

          {/* Ativou 3 */}
          <div style={{ background: isDark ? '#1a1a1a' : '#f5f5f5', border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`, borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px 0', fontWeight: 500 }}>Ativou 3 clientes</p>
            <div style={{ fontSize: '36px', fontWeight: 700, color: colors.textPrimary, marginBottom: '8px' }}>{ativou3}</div>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>clientes ativados</p>
          </div>
        </div>

        {/* Pipeline */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, margin: 0 }}>
            Pipeline de onboarding
          </h2>
            <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>arraste o cartão para mover de etapa</p>
          </div>

          {/* Barra de scroll */}
          <div
            ref={scrollBarRef}
            onScroll={handleScrollBar}
            style={{ overflowX: 'auto', overflowY: 'hidden', height: '16px', marginBottom: '12px', background: isDark ? '#0f0f0f' : '#fafafa', borderRadius: '4px' }}>
            <div style={{ height: '1px', width: `${etapas.length * 296}px` }} />
          </div>

          {/* Colunas do pipeline */}
          <div
            ref={columnsRef}
            onScroll={handleScrollColumns}
            className="pipeline-scroll"
            style={{ display: 'flex', gap: '16px', overflowX: 'auto', overflowY: 'hidden', paddingBottom: '0' }}>
            {etapas.map(etapa => {
              const revendasEtapa = getRevendasPorEtapa(etapa.id);
              const corEtapa = getCorEtapa(etapa.id);

              return (
                <div
                  key={etapa.id}
                  style={{
                    background: isDark ? '#1a1a1a' : '#f9f9f9',
                    border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minWidth: '280px',
                    flex: '0 0 280px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: corEtapa }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>{etapa.nome}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 600, color: colors.textSecondary, background: colors.borderColor, padding: '2px 8px', borderRadius: '4px' }}>
                      {revendasEtapa.length}
                    </span>
                  </div>

                  {revendasEtapa.map(revenda => (
                    <div
                      key={revenda.id}
                      style={{
                        background: isDark ? '#0f0f0f' : '#ffffff',
                        border: `1px solid ${isDark ? '#222' : '#e0e0e0'}`,
                        borderRadius: '8px',
                        padding: '12px',
                        cursor: 'move',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: corEtapa,
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: isDark ? '#000' : '#fff',
                          }}
                        >
                          {revenda.sigla}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {revenda.nome}
                          </p>
                          <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '2px 0 0 0' }}>
                            {revenda.responsavel}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textPrimary, background: corEtapa + '33', padding: '2px 8px', borderRadius: '4px' }}>
                          {revenda.status}
                        </span>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', color: colors.textSecondary }}>Progresso</span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textPrimary }}>{revenda.progresso}%</span>
                        </div>
                        <div style={{ height: '4px', borderRadius: '2px', background: colors.borderColor, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: corEtapa, width: `${revenda.progresso}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}

                  {revendasEtapa.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 12px', color: colors.textSecondary }}>
                      <p style={{ fontSize: '12px', margin: 0 }}>Nenhuma revenda</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal de Configuração */}
        {showConfig && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowConfig(false)}
          >
            <div
              style={{
                background: isDark ? '#1a1a1a' : '#fff',
                width: '100%',
                maxWidth: '600px',
                borderRadius: '12px',
                padding: '0',
                maxHeight: '85vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: `1px solid ${colors.borderColor}` }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textPrimary, margin: 0 }}>
                  Quadro
                </h2>
                <button
                  onClick={() => setShowConfig(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: colors.textSecondary,
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                {/* Input para nova etapa */}
                <input
                  type="text"
                  placeholder="Inserir Nova Etapa"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    background: isDark ? '#0f0f0f' : '#f9f9f9',
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    fontSize: '13px',
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddEtapa();
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />

                {/* Lista de etapas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {etapas.map((etapa, index) => (
                    <div
                      key={etapa.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: isDark ? '#0f0f0f' : '#f9f9f9',
                        borderRadius: '8px',
                        border: `1px solid ${colors.borderColor}`,
                      }}
                    >
                      <span style={{ color: colors.textSecondary, fontSize: '14px' }}>▼</span>
                      <input
                        type="text"
                        value={etapa.nome}
                        onChange={(e) => {
                          const newEtapas = [...etapas];
                          newEtapas[index].nome = e.target.value;
                          setEtapas(newEtapas);
                        }}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          color: colors.textPrimary,
                          fontSize: '13px',
                          fontWeight: 500,
                          outline: 'none',
                        }}
                      />
                      <select
                        style={{
                          background: isDark ? '#1a1a1a' : '#fff',
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.textPrimary,
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <option>Aberto</option>
                        <option>Executando</option>
                        <option>Impedimento</option>
                        <option>Concluído</option>
                        <option>Cancelado</option>
                        <option>Pausado</option>
                      </select>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '3px',
                          background: etapa.cor,
                          border: `1px solid ${colors.borderColor}`,
                          cursor: 'pointer',
                        }}
                      />
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: colors.textSecondary,
                          fontSize: '16px',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteEtapa(etapa.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#EF4444',
                          fontSize: '16px',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.borderColor}` }}>
                <button
                  onClick={() => setShowConfig(false)}
                  style={{
                    width: '100%',
                    background: isDark ? '#4a4a4a' : '#999',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Meta */}
        {showMetaModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
            }}
            onClick={() => setShowMetaModal(false)}
          >
            <div
              style={{
                background: isDark ? '#1a1a1a' : '#fff',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '12px',
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: `1px solid ${colors.borderColor}` }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textPrimary, margin: 0 }}>
                  Editar Meta de Implantações
                </h2>
                <button
                  onClick={() => setShowMetaModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: colors.textSecondary,
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 12px 0' }}>
                  Quantas implantações deseja atingir este mês?
                </p>
                <input
                  type="number"
                  min="1"
                  value={tempMeta}
                  onChange={(e) => setTempMeta(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.borderColor}`,
                    background: isDark ? '#0f0f0f' : '#f9f9f9',
                    color: colors.textPrimary,
                    fontSize: '16px',
                    fontWeight: 600,
                    boxSizing: 'border-box',
                  }}
                  autoFocus
                />
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', gap: '12px', padding: '16px 24px', borderTop: `1px solid ${colors.borderColor}` }}>
                <button
                  onClick={() => setShowMetaModal(false)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    color: colors.textPrimary,
                    border: `1px solid ${colors.borderColor}`,
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvarMeta}
                  style={{
                    flex: 1,
                    background: '#8B5CF6',
                    color: '#fff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GestorLayout>
  );
}
