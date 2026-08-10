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

interface Revenda {
  id: string;
  nome: string;
  cidade: string;
  status: 'ativa' | 'em-implantacao' | 'inativa';
  ultimoContato: string;
  responsavel: string;
}

const agentes = [
  'Ana Prado',
  'Bruno Lima',
  'Carla Dias',
  'Diego Souza',
  'Não atribuído',
];

export default function RevendasPage() {
  const [revendas, setRevendas] = useState<Revenda[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    nome: string;
    cidade: string;
    status: 'ativa' | 'em-implantacao' | 'inativa';
    ultimoContato: string;
    responsavel: string;
  }>({
    nome: '',
    cidade: '',
    status: 'ativa',
    ultimoContato: '',
    responsavel: 'Não atribuído',
  });

  useEffect(() => {
    const saved = localStorage.getItem('revendas-list');
    if (saved) {
      setRevendas(JSON.parse(saved));
    } else {
      const defaultRevendas: Revenda[] = [
        { id: '1', nome: 'Auto Nova Peças', cidade: 'São Paulo', status: 'em-implantacao', ultimoContato: new Date().toISOString().split('T')[0], responsavel: 'Ana Prado' },
        { id: '2', nome: 'MGX Automação', cidade: 'Belo Horizonte', status: 'ativa', ultimoContato: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], responsavel: 'Diego Souza' },
        { id: '3', nome: 'TecCampo', cidade: 'Curitiba', status: 'em-implantacao', ultimoContato: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], responsavel: 'Bruno Lima' },
        { id: '4', nome: 'Elétrica Pro', cidade: 'Rio de Janeiro', status: 'ativa', ultimoContato: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], responsavel: 'Carla Dias' },
      ];
      setRevendas(defaultRevendas);
      localStorage.setItem('revendas-list', JSON.stringify(defaultRevendas));
    }
  }, []);

  const saveRevendas = (data: Revenda[]) => {
    setRevendas(data);
    localStorage.setItem('revendas-list', JSON.stringify(data));
  };

  const handleAddRevenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.cidade) return;

    if (editingId) {
      saveRevendas(
        revendas.map(r =>
          r.id === editingId
            ? { ...r, ...formData }
            : r
        )
      );
      setEditingId(null);
    } else {
      const newRevenda: Revenda = {
        id: Date.now().toString(),
        ...formData,
      };
      saveRevendas([...revendas, newRevenda]);
    }

    setFormData({ nome: '', cidade: '', status: 'ativa', ultimoContato: new Date().toISOString().split('T')[0], responsavel: 'Não atribuído' });
  };

  const handleEdit = (revenda: Revenda) => {
    setEditingId(revenda.id);
    setFormData({
      nome: revenda.nome,
      cidade: revenda.cidade,
      status: revenda.status,
      ultimoContato: revenda.ultimoContato,
      responsavel: revenda.responsavel,
    });
  };

  const handleDelete = (id: string) => {
    saveRevendas(revendas.filter(r => r.id !== id));
    setEditingId(null);
  };

  const getDiasDesdeContato = (ultimoContato: string) => {
    const hoje = new Date();
    const data = new Date(ultimoContato);
    const diff = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredRevendas = revendas.filter(r =>
    r.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return COLORS.green;
      case 'em-implantacao': return COLORS.purple;
      case 'inativa': return COLORS.red;
      default: return COLORS.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'em-implantacao': return 'Em Implantação';
      case 'inativa': return 'Inativa';
      default: return status;
    }
  };

  return (
    <GestorLayout currentPage="revendas">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
            Revendas
          </h1>
          <p style={{ fontSize: '15px', color: COLORS.textSecondary, margin: 0 }}>
            Gerencie suas revendas e responsáveis
          </p>
        </div>

        {/* Formulário */}
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 20px 0' }}>
            {editingId ? 'Editar Revenda' : 'Adicionar Nova Revenda'}
          </h2>
          <form onSubmit={handleAddRevenda} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                  Nome da Revenda *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Auto Nova Peças"
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
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  placeholder="Ex: São Paulo"
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
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
                  <option value="ativa">Ativa</option>
                  <option value="em-implantacao">Em Implantação</option>
                  <option value="inativa">Inativa</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                  Responsável
                </label>
                <select
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
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
                  {agentes.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
                  Último Contato
                </label>
                <input
                  type="date"
                  value={formData.ultimoContato}
                  onChange={(e) => setFormData({ ...formData, ultimoContato: e.target.value })}
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
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
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
                {editingId ? 'Salvar Alterações' : 'Adicionar Revenda'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ nome: '', cidade: '', status: 'ativa', ultimoContato: new Date().toISOString().split('T')[0], responsavel: 'Não atribuído' });
                  }}
                  style={{
                    background: 'transparent',
                    color: COLORS.textSecondary,
                    border: `1px solid ${COLORS.borderColor}`,
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Busca */}
        <div>
          <input
            type="text"
            placeholder="Buscar por nome da revenda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.borderColor}`,
              borderRadius: '8px',
              color: COLORS.textPrimary,
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Lista de Revendas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
          {filteredRevendas.map(revenda => {
            const diasDesdeContato = getDiasDesdeContato(revenda.ultimoContato);
            const precisaDeAtencao = diasDesdeContato > 7;

            return (
              <div
                key={revenda.id}
                style={{
                  background: COLORS.cardBg,
                  border: `1px solid ${precisaDeAtencao ? COLORS.yellow : COLORS.borderColor}`,
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: COLORS.textPrimary }}>
                        {revenda.nome}
                      </h3>
                      <p style={{ margin: 0, fontSize: '12px', color: COLORS.textSecondary }}>
                        📍 {revenda.cidade}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: `${getStatusColor(revenda.status)}22`,
                        color: getStatusColor(revenda.status),
                      }}
                    >
                      {getStatusLabel(revenda.status)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>
                      👤 Responsável: <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{revenda.responsavel}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: precisaDeAtencao ? COLORS.yellow : COLORS.textSecondary }}>
                      📅 Último contato: {new Date(revenda.ultimoContato).toLocaleDateString('pt-BR')}
                      {precisaDeAtencao && <span style={{ marginLeft: '8px', fontWeight: 600 }}>({diasDesdeContato} dias) ⚠️</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: `1px solid ${COLORS.borderColor}` }}>
                  <button
                    onClick={() => handleEdit(revenda)}
                    style={{
                      flex: 1,
                      background: COLORS.purple,
                      color: '#fff',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(revenda.id)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: COLORS.red,
                      border: `1px solid ${COLORS.red}44`,
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GestorLayout>
  );
}
