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

interface Alerta {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'ativo' | 'lido' | 'resolvido';
  dataCriacao: string;
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [formData, setFormData] = useState<{
    titulo: string;
    descricao: string;
    prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  }>({
    titulo: '',
    descricao: '',
    prioridade: 'media',
  });
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativo' | 'lido' | 'resolvido'>('ativo');

  useEffect(() => {
    const saved = localStorage.getItem('alertas-list');
    if (saved) {
      setAlertas(JSON.parse(saved));
    }
  }, []);

  const saveAlertas = (data: Alerta[]) => {
    setAlertas(data);
    localStorage.setItem('alertas-list', JSON.stringify(data));
  };

  const handleAddAlerta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descricao.trim()) return;

    const newAlerta: Alerta = {
      id: Date.now().toString(),
      titulo: formData.titulo,
      descricao: formData.descricao,
      prioridade: formData.prioridade,
      status: 'ativo',
      dataCriacao: new Date().toISOString().split('T')[0],
    };

    saveAlertas([...alertas, newAlerta]);
    setFormData({ titulo: '', descricao: '', prioridade: 'media' });
  };

  const handleMarkAsRead = (id: string) => {
    saveAlertas(
      alertas.map(a =>
        a.id === id ? { ...a, status: 'lido' } : a
      )
    );
  };

  const handleResolve = (id: string) => {
    saveAlertas(
      alertas.map(a =>
        a.id === id ? { ...a, status: 'resolvido' } : a
      )
    );
  };

  const handleDelete = (id: string) => {
    saveAlertas(alertas.filter(a => a.id !== id));
  };

  const alertasFiltered = alertas.filter(a => {
    if (filterStatus === 'todos') return true;
    return a.status === filterStatus;
  });

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return COLORS.green;
      case 'media': return COLORS.yellow;
      case 'alta': return { bg: COLORS.red, light: `${COLORS.red}22` };
      case 'critica': return { bg: COLORS.red, light: `${COLORS.red}33` };
      default: return COLORS.textSecondary;
    }
  };

  return (
    <GestorLayout currentPage="alertas">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
            Alertas
          </h1>
          <p style={{ fontSize: '15px', color: COLORS.textSecondary, margin: 0 }}>
            Gerencie alertas e notificações importantes
          </p>
        </div>

        {/* Formulário */}
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 20px 0' }}>
            Criar Novo Alerta
          </h2>
          <form onSubmit={handleAddAlerta} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Manutenção programada"
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

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o alerta..."
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
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                  Prioridade
                </label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${COLORS.borderColor}`,
                    borderRadius: '8px',
                    color: COLORS.textPrimary,
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    height: '112px',
                  }}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
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
              Criar Alerta
            </button>
          </form>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['todos', 'ativo', 'lido', 'resolvido'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
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
              {status === 'todos' ? 'Todos' : status === 'ativo' ? 'Ativos' : status === 'lido' ? 'Lidos' : 'Resolvidos'}
            </button>
          ))}
        </div>

        {/* Lista de Alertas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alertasFiltered.length === 0 ? (
            <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
              <p style={{ color: COLORS.textSecondary, fontSize: '14px' }}>
                {filterStatus === 'todos'
                  ? 'Nenhum alerta cadastrado'
                  : `Nenhum alerta ${filterStatus}`}
              </p>
            </div>
          ) : (
            alertasFiltered.map(alerta => {
              const isAtivo = alerta.status === 'ativo';
              const colors = getPriorityColor(alerta.prioridade);
              const colorObj = typeof colors === 'object' ? colors : { bg: colors };

              return (
                <div
                  key={alerta.id}
                  style={{
                    background: COLORS.cardBg,
                    border: `1px solid ${colorObj.bg}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    gap: '16px',
                    opacity: alerta.status === 'resolvido' ? 0.6 : 1,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '18px' }}>
                        {alerta.status === 'resolvido' ? '✓' : alerta.prioridade === 'critica' ? '🚨' : '🔔'}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: COLORS.textPrimary }}>
                        {alerta.titulo}
                      </h3>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: `${colorObj.bg}22`,
                            color: colorObj.bg,
                          }}
                        >
                          {alerta.prioridade.toUpperCase()}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: alerta.status === 'resolvido' ? `${COLORS.green}22` : `${COLORS.yellow}22`,
                            color: alerta.status === 'resolvido' ? COLORS.green : COLORS.yellow,
                          }}
                        >
                          {alerta.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: '8px 0', fontSize: '13px', color: COLORS.textSecondary, textDecoration: alerta.status === 'resolvido' ? 'line-through' : 'none' }}>
                      {alerta.descricao}
                    </p>

                    <div style={{ fontSize: '11px', color: COLORS.textTertiary, marginTop: '8px' }}>
                      📅 {new Date(alerta.dataCriacao).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                    {isAtivo && (
                      <button
                        onClick={() => handleMarkAsRead(alerta.id)}
                        style={{
                          background: COLORS.yellow,
                          color: COLORS.darkBg,
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        👁️ Lido
                      </button>
                    )}
                    {alerta.status !== 'resolvido' && (
                      <button
                        onClick={() => handleResolve(alerta.id)}
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
                        ✓ Resolver
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(alerta.id)}
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
                      🗑️ Remover
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </GestorLayout>
  );
}
