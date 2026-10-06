'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { useState, useEffect } from 'react';
import '@/app/globals.css';
import { getModulos, loadCustom, CUSTOM_KEY, MODULO_IDS, PROGRESS_KEY, temaKey, type CustomTreinamentos, type ModuloId, type TreinamentoItem } from './data';

import { LivesTab } from './LivesTab';
import { AgendaTab } from './AgendaTab';
import { LIVES_TABLE, type Live } from './lives';
import { SESSOES_TABLE, type SessaoTreinamento } from './agenda';
import { useLocalTable } from '@/lib/supabase/hooks';
import type { Implantacao } from '../implantacoes/data';

const emptyNovo =(modulo: ModuloId) => ({ modulo, title: '', obj: '', temas: '' });

const LIGHT_THEME = {
  background: '#F9F7F4',
  cardBg: '#FFFFFF',
  borderColor: '#E8E4DC',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#A0A0A0',
  purple: '#7C5CF0',
  yellow: '#E6B23E',
};

const DARK_THEME = {
  background: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#2A2D33',
  textPrimary: '#F5F5F5',
  textSecondary: '#B8BFCC',
  textTertiary: '#7A8290',
  purple: '#9D7EFF',
  yellow: '#F5C947',
};

export default function JornadaCapacitacaoPage() {
  const { isDark } = useTheme();
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  const [mainTab, setMainTab] = useState('treinamentos');
  const [subTab, setSubTab] = useState<ModuloId>('lcweb');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [custom, setCustom] = useState<CustomTreinamentos>({});
  const [novoOpen, setNovoOpen] = useState(false);
  const [novo, setNovo] = useState(emptyNovo('lcweb'));
  const [novoError, setNovoError] = useState('');
  const livesTable = useLocalTable<Live>(LIVES_TABLE);
  const sessoesTable = useLocalTable<SessaoTreinamento>(SESSOES_TABLE);
  const { data: implantacoes } = useLocalTable<Implantacao>('implantacoes');
  const revendas = [...new Set(implantacoes.map(i => i.revenda).filter(Boolean))].sort();

  useEffect(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
    setCustom(loadCustom());
  }, []);

  const modulos = getModulos(custom);

  const saveCustom = (next: CustomTreinamentos) => {
    setCustom(next);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
  };

  const openNovo = () => {
    setNovo(emptyNovo(subTab));
    setNovoError('');
    setNovoOpen(true);
  };

  const handleAddTreinamento = (e: React.FormEvent) => {
    e.preventDefault();
    const title = novo.title.trim();
    const temas = novo.temas.split('\n').map(t => t.trim()).filter(Boolean);
    if (!title) return setNovoError('Informe o título do treinamento.');
    if (temas.length === 0) return setNovoError('Adicione pelo menos um tema (um por linha).');

    const modulo = modulos.find(m => m.id === novo.modulo)!;
    const day = Math.max(0, ...modulo.items.map(i => i.day)) + 1;
    const item: TreinamentoItem = { day, title, obj: novo.obj.trim(), temas };
    saveCustom({ ...custom, [novo.modulo]: [...(custom[novo.modulo] || []), item] });

    setSubTab(novo.modulo);
    setExpandedDays(prev => ({ ...prev, [day]: true }));
    setNovoOpen(false);
  };

  const handleRemoveTreinamento = (item: TreinamentoItem) => {
    if (!window.confirm(`Remover o treinamento "Dia ${item.day} · ${item.title}"?`)) return;
    saveCustom({ ...custom, [subTab]: (custom[subTab] || []).filter(i => i.day !== item.day) });
    const prefix = temaKey(subTab, item.day, 0).replace(/0$/, '');
    const remaining = Object.fromEntries(Object.entries(checkedItems).filter(([k]) => !k.startsWith(prefix)));
    setCheckedItems(remaining);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(remaining));
  };

  const handleCheck = (key: string) => {
    const newState = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newState);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(newState));
  };

  const toggleDay = (dayNum: number) => {
    setExpandedDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const currentData = modulos.find(m => m.id === subTab)!;
  const temasTotal = currentData.items.reduce((s, i) => s + i.temas.length, 0);
  const temasFeitos = currentData.items.reduce(
    (s, i) => s + i.temas.filter((_, idx) => checkedItems[temaKey(subTab, i.day, idx)]).length,
    0
  );
  const progresso = temasTotal ? Math.round((temasFeitos / temasTotal) * 100) : 0;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: theme.background,
    border: `1px solid ${theme.borderColor}`,
    borderRadius: '10px',
    color: theme.textPrimary,
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: theme.textSecondary, display: 'block', marginBottom: '6px' };

  return (
    <PlatformLayout currentPage="treinamentos">
      <div style={{ padding: '32px', background: theme.background, minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 8px 0' }}>
              Jornada de capacitação
            </h1>
            <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0 }}>
              24 sessões no trimestre · atualizado há 2 min
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: isDark ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.05)', padding: '8px', borderRadius: '12px', width: 'fit-content' }}>
          {['treinamentos', 'lives', 'agenda'].map(tab => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              style={{
                border: 'none',
                background: mainTab === tab ? '#7C5CF0' : 'transparent',
                color: mainTab === tab ? '#fff' : theme.textSecondary,
                fontSize: '14px',
                fontWeight: '700',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {tab === 'treinamentos' ? 'Treinamentos' : tab === 'lives' ? 'Lives' : 'Agenda'}
            </button>
          ))}
        </div>

        {/* Treinamentos Tab */}
        {mainTab === 'treinamentos' && (
          <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '24px' }}>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>Dias de treinamento</p>
                <div style={{ fontSize: '40px', fontWeight: 700, color: theme.textPrimary, marginBottom: '8px' }}>{currentData.items.length}</div>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>para este módulo</p>
              </div>

              <div style={{ background: isDark ? 'rgba(230, 178, 62, 0.1)' : 'rgba(230, 178, 62, 0.08)', border: `1px solid ${theme.yellow}`, borderRadius: '16px', padding: '24px' }}>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>Temas totais</p>
                <div style={{ fontSize: '40px', fontWeight: 700, color: theme.yellow, marginBottom: '8px' }}>{temasTotal}</div>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>para aprender</p>
              </div>

              <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '24px' }}>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>Concluídos</p>
                <div style={{ fontSize: '40px', fontWeight: 700, color: theme.textPrimary, marginBottom: '8px' }}>{temasFeitos}</div>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>temas finalizados</p>
              </div>

              <div style={{ background: isDark ? 'rgba(123, 92, 240, 0.1)' : 'rgba(230, 212, 255, 0.5)', border: `1px solid ${isDark ? '#5B43C0' : '#DDD4E8'}`, borderRadius: '16px', padding: '24px' }}>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>Progresso</p>
                <div style={{ fontSize: '40px', fontWeight: 700, color: isDark ? '#B7A8E6' : '#7C5CF0', marginBottom: '8px' }}>{progresso}%</div>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>completado</p>
              </div>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', background: isDark ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.05)', padding: '8px', borderRadius: '12px', width: 'fit-content' }}>
              {MODULO_IDS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setSubTab(tab)}
                  style={{
                    border: 'none',
                    background: subTab === tab ? '#7C5CF0' : 'transparent',
                    color: subTab === tab ? '#fff' : theme.textSecondary,
                    fontSize: '14px',
                    fontWeight: '700',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {tab === 'lcweb' ? 'LC WEB' : tab === 'lcerp' ? 'LC ERP Desktop' : 'Serviços adicionais'}
                </button>
              ))}
            </div>
            <button
              onClick={openNovo}
              style={{ padding: '11px 18px', background: '#E6B23E', border: 'none', borderRadius: '12px', color: '#1A1A1A', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap' }}
            >
              + Novo treinamento
            </button>
            </div>

            {/* Day Cards */}
            <div>
              {currentData.items.map(item => (
                <div
                  key={item.day}
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '12px',
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    onClick={() => toggleDay(item.day)}
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      justifyContent: 'space-between',
                      background: expandedDays[item.day] ? theme.background : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: '#7C5CF0',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '16px'
                        }}
                      >
                        {item.day}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: theme.textPrimary }}>
                          {item.title}
                        </h3>
                        <p style={{ margin: 0, fontSize: '13px', color: theme.textSecondary }}>
                          {item.obj}
                        </p>
                      </div>
                    </div>
                    {item.custom && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleRemoveTreinamento(item);
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#D9534F', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}
                      >
                        Remover
                      </button>
                    )}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke={theme.textSecondary}
                      strokeWidth="2"
                      style={{
                        transform: expandedDays[item.day] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <polyline points="2 4 6 8 10 4" />
                    </svg>
                  </div>

                  {expandedDays[item.day] && (
                    <div style={{ borderTop: `1px solid ${theme.borderColor}`, padding: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {item.temas.map((tema, idx) => {
                          const key = temaKey(subTab, item.day, idx);
                          const isChecked = checkedItems[key] || false;
                          return (
                            <label
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 0',
                                cursor: 'pointer',
                                opacity: isChecked ? 0.6 : 1
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheck(key)}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  cursor: 'pointer',
                                  accentColor: '#7C5CF0'
                                }}
                              />
                              <code
                                style={{
                                  background: isDark ? 'rgba(124, 92, 240, 0.2)' : 'rgba(124, 92, 240, 0.1)',
                                  color: '#7C5CF0',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  fontFamily: 'monospace',
                                  textDecoration: isChecked ? 'line-through' : 'none'
                                }}
                              >
                                {tema}
                              </code>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lives Tab */}
        {mainTab === 'lives' && <LivesTab theme={theme} table={livesTable} />}

        {mainTab === 'agenda' && (
          <AgendaTab theme={theme} isDark={isDark} lives={livesTable} sessoes={sessoesTable} modulos={modulos} revendas={revendas} />
        )}


        {novoOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}
            onClick={() => setNovoOpen(false)}
          >
            <div
              style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '18px', maxWidth: '560px', width: '100%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${theme.borderColor}` }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Novo treinamento</h2>
                <button
                  onClick={() => setNovoOpen(false)}
                  style={{ background: 'transparent', border: `1px solid ${theme.borderColor}`, borderRadius: '8px', width: '32px', height: '32px', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddTreinamento} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
                <div style={{ display: 'grid', gap: '14px', padding: '20px 24px', overflowY: 'auto' }}>
                  <div>
                    <label style={labelStyle}>Módulo *</label>
                    <select value={novo.modulo} onChange={e => setNovo({ ...novo, modulo: e.target.value as ModuloId })} style={inputStyle}>
                      {modulos.map(m => (
                        <option key={m.id} value={m.id}>{m.label}</option>
                      ))}
                    </select>
                    <p style={{ fontSize: '12px', color: theme.textTertiary, margin: '6px 0 0' }}>
                      Será adicionado como Dia {Math.max(0, ...modulos.find(m => m.id === novo.modulo)!.items.map(i => i.day)) + 1}.
                    </p>
                  </div>
                  <div>
                    <label style={labelStyle}>Título *</label>
                    <input value={novo.title} onChange={e => setNovo({ ...novo, title: e.target.value })} placeholder="Ex: Integrações bancárias" style={inputStyle} autoFocus />
                  </div>
                  <div>
                    <label style={labelStyle}>Objetivo</label>
                    <textarea
                      value={novo.obj}
                      onChange={e => setNovo({ ...novo, obj: e.target.value })}
                      placeholder="O que a revenda vai dominar ao final deste dia"
                      rows={2}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Temas * (um por linha)</label>
                    <textarea
                      value={novo.temas}
                      onChange={e => setNovo({ ...novo, temas: e.target.value })}
                      placeholder={'Financeiro/Boletos\nFinanceiro/Conciliação'}
                      rows={6}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
                    />
                  </div>

                  {novoError && (
                    <div style={{ background: 'rgba(217, 83, 79, 0.12)', color: '#D9534F', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
                      {novoError}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', padding: '16px 24px', borderTop: `1px solid ${theme.borderColor}` }}>
                  <button
                    type="button"
                    onClick={() => setNovoOpen(false)}
                    style={{ padding: '10px 18px', background: 'transparent', border: `1px solid ${theme.borderColor}`, borderRadius: '10px', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 18px', background: '#E6B23E', border: 'none', borderRadius: '10px', color: '#1A1A1A', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit' }}
                  >
                    Salvar treinamento
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
