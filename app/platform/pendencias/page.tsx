'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';
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

interface Pendencia {
  id: string;
  revenda: string;
  descricao: string;
  nivel: 'critica' | 'normal';
  status: 'aberta' | 'resolvida';
  dataAbertura: string;
}

const revendas = [
  'Auto Nova Peças',
  'MGX Automação',
  'TecCampo',
  'Elétrica Pro',
  'Nova Rota Distribuição',
  'Força Distribuidora',
];

export default function PendenciasPage() {
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const [formData, setFormData] = useState({
    revenda: '',
    descricao: '',
    nivel: 'normal' as const,
  });
  const [filterStatus, setFilterStatus] = useState<'todas' | 'abertas' | 'resolvidas'>('abertas');

  // Carregar do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pendencias-list');
    if (saved) {
      setPendencias(JSON.parse(saved));
    }
  }, []);

  // Salvar no localStorage
  const savePendencias = (data: Pendencia[]) => {
    setPendencias(data);
    localStorage.setItem('pendencias-list', JSON.stringify(data));
  };

  // Adicionar nova pendência
  const handleAddPendencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.revenda || !formData.descricao.trim()) return;

    const newPendencia: Pendencia = {
      id: Date.now().toString(),
      revenda: formData.revenda,
      descricao: formData.descricao,
      nivel: formData.nivel,
      status: 'aberta',
      dataAbertura: new Date().toISOString().split('T')[0],
    };

    savePendencias([...pendencias, newPendencia]);
    setFormData({ revenda: '', descricao: '', nivel: 'normal' });
  };

  // Marcar como resolvida
  const handleResolve = (id: string) => {
    savePendencias(
      pendencias.map(p =>
        p.id === id ? { ...p, status: 'resolvida' } : p
      )
    );
  };

  // Deletar pendência
  const handleDelete = (id: string) => {
    savePendencias(pendencias.filter(p => p.id !== id));
  };

  // Calcular dias abertos
  const getDiasAbertos = (dataAbertura: string) => {
    const hoje = new Date();
    const data = new Date(dataAbertura);
    const diff = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Filtrar pendências
  const pendenciasFiltered = pendencias.filter(p => {
    if (filterStatus === 'abertas') return p.status === 'aberta';
    if (filterStatus === 'resolvidas') return p.status === 'resolvida';
    return true;
  });

  const totalAbertas = pendencias.filter(p => p.status === 'aberta').length;
  const totalCriticas = pendencias.filter(p => p.status === 'aberta' && p.nivel === 'critica').length;

  return (
    <PlatformLayout currentPage="pendencias">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
            Pendências
          </h1>
          <p style={{ fontSize: '15px', color: COLORS.textSecondary, margin: 0 }}>
            Acompanhe e resolva as pendências das revendas
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Pendências Abertas</p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{totalAbertas}</p>
          </div>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Críticas</p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: COLORS.red, margin: 0 }}>{totalCriticas}</p>
          </div>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Total</p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{pendencias.length}</p>
          </div>
        </div>

        {/* Formulário */}
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 20px 0' }}>
            Cadastrar Nova Pendência
          </h2>
          <form onSubmit={handleAddPendencia} style={{ display: 'grid', gap: '16px' }}>
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
                  Nível *
                </label>
                <select
                  value={formData.nivel}
                  onChange={(e) => setFormData({ ...formData, nivel: e.target.value as 'critica' | 'normal' })}
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
                  <option value="normal">Normal</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                Descrição do Problema *
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Dados fiscais pendentes, integração com sistema legado, etc."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${COLORS.borderColor}`,
                  borderRadius: '8px',
                  color: COLORS.textPrimary,
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  minHeight: '80px',
                  resize: 'vertical',
                }}
              />
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
              Adicionar Pendência
            </button>
          </form>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['todas', 'abertas', 'resolvidas'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: filterStatus === status ? COLORS.purple : 'transparent',
                color: filterStatus === status ? '#fff' : COLORS.textSecondary,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {status === 'todas' ? 'Todas' : status === 'abertas' ? 'Abertas' : 'Resolvidas'}
            </button>
          ))}
        </div>

        {/* Lista de Pendências */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendenciasFiltered.length === 0 ? (
            <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
              <p style={{ color: COLORS.textSecondary, fontSize: '14px' }}>
                {filterStatus === 'todas'
                  ? 'Nenhuma pendência cadastrada'
                  : filterStatus === 'abertas'
                  ? 'Nenhuma pendência aberta'
                  : 'Nenhuma pendência resolvida'}
              </p>
            </div>
          ) : (
            pendenciasFiltered.map(pendencia => {
              const diasAbertos = getDiasAbertos(pendencia.dataAbertura);
              const isCritica = pendencia.nivel === 'critica';
              const isAberta = pendencia.status === 'aberta';

              return (
                <div
                  key={pendencia.id}
                  style={{
                    background: COLORS.cardBg,
                    border: `1px solid ${isAberta ? (isCritica ? COLORS.red : COLORS.borderColor) : COLORS.green}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    gap: '16px',
                    opacity: pendencia.status === 'resolvida' ? 0.6 : 1,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '18px' }}>
                        {pendencia.status === 'resolvida' ? '✓' : isCritica ? '⚠️' : '●'}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: COLORS.textPrimary }}>
                        {pendencia.revenda}
                      </h3>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: isCritica ? `${COLORS.red}22` : `${COLORS.yellow}22`,
                            color: isCritica ? COLORS.red : COLORS.yellow,
                          }}
                        >
                          {isCritica ? 'CRÍTICA' : 'NORMAL'}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: pendencia.status === 'resolvida' ? `${COLORS.green}22` : `${COLORS.yellow}22`,
                            color: pendencia.status === 'resolvida' ? COLORS.green : COLORS.yellow,
                          }}
                        >
                          {pendencia.status === 'aberta' ? 'ABERTA' : 'RESOLVIDA'}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: '8px 0', fontSize: '13px', color: COLORS.textSecondary, textDecoration: pendencia.status === 'resolvida' ? 'line-through' : 'none' }}>
                      {pendencia.descricao}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
                      <span style={{ fontSize: '12px', color: COLORS.textTertiary }}>
                        📅 Aberta em {new Date(pendencia.dataAbertura).toLocaleDateString('pt-BR')}
                      </span>
                      {isAberta && (
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: diasAbertos > 7 ? COLORS.red : COLORS.yellow,
                          }}
                        >
                          ⏰ {diasAbertos} dias aberta
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                    {pendencia.status === 'aberta' && (
                      <button
                        onClick={() => handleResolve(pendencia.id)}
                        style={{
                          background: COLORS.green,
                          color: '#fff',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ✓ Resolver
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(pendencia.id)}
                      style={{
                        background: 'transparent',
                        color: COLORS.red,
                        border: `1px solid ${COLORS.red}44`,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Remover
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}
