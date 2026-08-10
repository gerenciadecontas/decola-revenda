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
  const [formData, setFormData] = useState<{
    revenda: string;
    descricao: string;
    nivel: 'critica' | 'normal';
  }>({
    revenda: '',
    descricao: '',
    nivel: 'normal',
  });

  useEffect(() => {
    const saved = localStorage.getItem('pendencias-list');
    if (saved) {
      setPendencias(JSON.parse(saved));
    }
  }, []);

  const savePendencias = (data: Pendencia[]) => {
    setPendencias(data);
    localStorage.setItem('pendencias-list', JSON.stringify(data));
  };

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

  const handleResolve = (id: string) => {
    savePendencias(
      pendencias.map(p =>
        p.id === id ? { ...p, status: 'resolvida' } : p
      )
    );
  };

  const handleDelete = (id: string) => {
    savePendencias(pendencias.filter(p => p.id !== id));
  };

  const getDiasAbertos = (dataAbertura: string) => {
    const hoje = new Date();
    const data = new Date(dataAbertura);
    const diff = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const pendenciasAbertas = pendencias.filter(p => p.status === 'aberta');

  return (
    <GestorLayout currentPage="pendencias">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
            Pendências
          </h1>
          <p style={{ fontSize: '15px', color: COLORS.textSecondary, margin: 0 }}>
            Cadastre e acompanhe as pendências das revendas
          </p>
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
                Descrição *
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva o problema ou pendência..."
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

        {/* Lista Simples */}
        {pendenciasAbertas.length > 0 && (
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 16px 0' }}>
              Pendências Abertas ({pendenciasAbertas.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendenciasAbertas.map(p => (
                <div
                  key={p.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${p.nivel === 'critica' ? COLORS.red : COLORS.yellow}44`,
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: p.nivel === 'critica' ? `${COLORS.red}22` : `${COLORS.yellow}22`, color: p.nivel === 'critica' ? COLORS.red : COLORS.yellow }}>
                        {p.nivel === 'critica' ? 'CRÍTICA' : 'NORMAL'}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary }}>{p.revenda}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: COLORS.textSecondary }}>{p.descricao}</p>
                    <div style={{ fontSize: '11px', color: COLORS.textTertiary, marginTop: '6px' }}>
                      Aberta há {getDiasAbertos(p.dataAbertura)} dias
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                    <button
                      onClick={() => handleResolve(p.id)}
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
                      ✓
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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
              ))}
            </div>
          </div>
        )}
      </div>
    </GestorLayout>
  );
}
