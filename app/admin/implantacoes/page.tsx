'use client';

import { GestorLayout } from '@/app/components/GestorLayout';
import { useState, useEffect } from 'react';

const COLORS = {
  purple: '#8B5CF6',
  yellow: '#FFC93C',
  green: '#34D399',
  red: '#F87171',
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
  etapa: 'kickoff' | 'configuracao' | 'testes' | 'golive';
  progresso: number;
  dataPrevista: string;
  status: 'em-andamento' | 'concluida';
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
  { value: 'kickoff', label: 'Kickoff' },
  { value: 'configuracao', label: 'Configuração' },
  { value: 'testes', label: 'Testes' },
  { value: 'golive', label: 'Go-live' },
];

export default function ImplantacoesPage() {
  const [implantacoes, setImplantacoes] = useState<Implantacao[]>([]);
  const [formData, setFormData] = useState<{
    revenda: string;
    etapa: 'kickoff' | 'configuracao' | 'testes' | 'golive';
    progresso: number;
    dataPrevista: string;
  }>({
    revenda: '',
    etapa: 'kickoff',
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
    if (!formData.revenda || !formData.dataPrevista) return;

    const newImplantacao: Implantacao = {
      id: Date.now().toString(),
      revenda: formData.revenda,
      etapa: formData.etapa,
      progresso: formData.progresso,
      dataPrevista: formData.dataPrevista,
      status: 'em-andamento',
    };

    saveImplantacoes([...implantacoes, newImplantacao]);
    setFormData({ revenda: '', etapa: 'kickoff', progresso: 0, dataPrevista: '' });
  };

  const handleUpdateProgress = (id: string, newProgress: number) => {
    saveImplantacoes(
      implantacoes.map(i =>
        i.id === id ? { ...i, progresso: newProgress } : i
      )
    );
  };

  const handleComplete = (id: string) => {
    saveImplantacoes(
      implantacoes.map(i =>
        i.id === id ? { ...i, status: 'concluida', progresso: 100 } : i
      )
    );
  };

  const handleDelete = (id: string) => {
    saveImplantacoes(implantacoes.filter(i => i.id !== id));
  };

  const implantacoesEmAndamento = implantacoes.filter(i => i.status === 'em-andamento');
  const hoje = new Date().toISOString().split('T')[0];
  const implantacoesHoje = implantacoesEmAndamento.filter(i => i.dataPrevista === hoje);

  return (
    <GestorLayout currentPage="implantacoes">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
            Implantações
          </h1>
          <p style={{ fontSize: '15px', color: COLORS.textSecondary, margin: 0 }}>
            Cadastre e acompanhe o progresso das implantações
          </p>
        </div>

        {/* Formulário */}
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 20px 0' }}>
            Nova Implantação
          </h2>
          <form onSubmit={handleAddImplantacao} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  Etapa *
                </label>
                <select
                  value={formData.etapa}
                  onChange={(e) => setFormData({ ...formData, etapa: e.target.value as any })}
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
                  {etapas.map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                  Data Prevista *
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
            </div>
            <button
              type="submit"
              style={{
                background: COLORS.purple,
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Adicionar Implantação
            </button>
          </form>
        </div>

        {/* Lista */}
        {implantacoesEmAndamento.length > 0 && (
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 16px 0' }}>
              Implantações em Andamento ({implantacoesEmAndamento.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {implantacoesEmAndamento.map(impl => {
                const etapaLabel = etapas.find(e => e.value === impl.etapa)?.label || impl.etapa;
                const isToday = impl.dataPrevista === hoje;
                const dataPrevista = new Date(impl.dataPrevista).toLocaleDateString('pt-BR');

                return (
                  <div
                    key={impl.id}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isToday ? COLORS.yellow : COLORS.borderColor}`,
                      borderRadius: '10px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary }}>{impl.revenda}</span>
                          {isToday && (
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: `${COLORS.yellow}22`, color: COLORS.yellow }}>
                              HOJE
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: COLORS.textSecondary }}>
                          {etapaLabel} · Previsto para {dataPrevista}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                        <button
                          onClick={() => handleComplete(impl.id)}
                          style={{
                            background: COLORS.green,
                            color: '#fff',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ✓ Concluir
                        </button>
                        <button
                          onClick={() => handleDelete(impl.id)}
                          style={{
                            background: 'transparent',
                            color: COLORS.red,
                            border: `1px solid ${COLORS.red}44`,
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: COLORS.textSecondary }}>Progresso</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textPrimary }}>{impl.progresso}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <div style={{ height: '6px', borderRadius: '6px', background: COLORS.borderColor, overflow: 'hidden', flex: 1 }}>
                          <div style={{ height: '100%', borderRadius: '6px', width: `${impl.progresso}%`, background: impl.progresso === 100 ? COLORS.green : COLORS.yellow }} />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={impl.progresso}
                          onChange={(e) => handleUpdateProgress(impl.id, parseInt(e.target.value))}
                          style={{
                            width: '100px',
                            height: '4px',
                            cursor: 'pointer',
                            accentColor: COLORS.yellow,
                          }}
                          title="Ajuste o progresso"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </GestorLayout>
  );
}
