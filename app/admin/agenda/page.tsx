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

interface Compromisso {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  tipo: 'treinamento' | 'reuniao' | 'visita' | 'outro';
  descricao: string;
}

const tipos = [
  { value: 'treinamento', label: '📚 Treinamento' },
  { value: 'reuniao', label: '👥 Reunião' },
  { value: 'visita', label: '📍 Visita' },
  { value: 'outro', label: '📌 Outro' },
];

export default function AgendaPage() {
  const [compromissos, setCompromisos] = useState<Compromisso[]>([]);
  const [formData, setFormData] = useState<{
    titulo: string;
    data: string;
    hora: string;
    tipo: 'treinamento' | 'reuniao' | 'visita' | 'outro';
    descricao: string;
  }>({
    titulo: '',
    data: '',
    hora: '',
    tipo: 'outro',
    descricao: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('agenda-list');
    if (saved) {
      setCompromisos(JSON.parse(saved));
    }
  }, []);

  const saveCompromisos = (data: Compromisso[]) => {
    setCompromisos(data);
    localStorage.setItem('agenda-list', JSON.stringify(data));
  };

  const handleAddCompromisos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.data || !formData.hora) return;

    const newCompromisos: Compromisso = {
      id: Date.now().toString(),
      titulo: formData.titulo,
      data: formData.data,
      hora: formData.hora,
      tipo: formData.tipo,
      descricao: formData.descricao,
    };

    saveCompromisos([...compromissos, newCompromisos]);
    setFormData({ titulo: '', data: '', hora: '', tipo: 'outro', descricao: '' });
  };

  const handleDelete = (id: string) => {
    saveCompromisos(compromissos.filter(c => c.id !== id));
  };

  const compromissosPorDia = (data: string) => {
    return compromissos.filter(c => c.data === data).sort((a, b) => a.hora.localeCompare(b.hora));
  };

  const getDiasProxima7Dias = () => {
    const dias = [];
    const hoje = new Date();
    for (let i = 0; i < 7; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() + i);
      dias.push(data.toISOString().split('T')[0]);
    }
    return dias;
  };

  const diasProximos = getDiasProxima7Dias();
  const totalCompromisos = compromissos.length;

  const getNomeDia = (dataStr: string) => {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const data = new Date(dataStr + 'T00:00:00');
    return dias[data.getDay()];
  };

  const formatData = (dataStr: string) => {
    return new Date(dataStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <GestorLayout currentPage="agenda">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
            Minha Agenda
          </h1>
          <p style={{ fontSize: '15px', color: COLORS.textSecondary, margin: 0 }}>
            Organize seus compromissos da semana
          </p>
        </div>

        {/* Formulário */}
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 20px 0' }}>
            Novo Compromisso
          </h2>
          <form onSubmit={handleAddCompromisos} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Treinamento LC WEB - MGX"
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
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
                  Hora *
                </label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
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
                  Tipo *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
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
                  {tipos.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                Descrição (opcional)
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Detalhes sobre o compromisso..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${COLORS.borderColor}`,
                  borderRadius: '8px',
                  color: COLORS.textPrimary,
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  minHeight: '60px',
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
              Adicionar Compromisso
            </button>
          </form>
        </div>

        {/* Agenda por Dia */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0' }}>
            Próximos 7 dias ({totalCompromisos} compromissos)
          </h2>
          {diasProximos.map(dia => (
            <div key={dia} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: 'rgba(139,92,246,0.1)', padding: '14px 16px', borderBottom: `1px solid ${COLORS.borderColor}` }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary }}>
                  {getNomeDia(dia)} · {formatData(dia)}
                </div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                {compromissosPorDia(dia).length === 0 ? (
                  <p style={{ margin: 0, fontSize: '13px', color: COLORS.textSecondary }}>Sem compromissos</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {compromissosPorDia(dia).map(comp => {
                      const tipoObj = tipos.find(t => t.value === comp.tipo);
                      return (
                        <div
                          key={comp.id}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${COLORS.borderColor}44`,
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: COLORS.yellow }}>{comp.hora}</span>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>{comp.titulo}</span>
                            </div>
                            {comp.descricao && (
                              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: COLORS.textSecondary }}>{comp.descricao}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(comp.id)}
                            style={{
                              background: 'transparent',
                              color: COLORS.red,
                              border: `1px solid ${COLORS.red}44`,
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              marginLeft: '12px',
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GestorLayout>
  );
}
