'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { useTheme } from '@/app/context/ThemeContext';
import { useTable } from '@/lib/supabase/hooks';
import { ETAPA_CONCLUIDA, PRIORIDADES, STAGES, statusFor, type Implantacao } from '../data';
import '@/app/globals.css';

const LIGHT_THEME = {
  background: '#F9F7F4',
  cardBg: '#FFFFFF',
  borderColor: '#E8E4DC',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#A0A0A0',
};

const DARK_THEME = {
  background: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#2A2D33',
  textPrimary: '#F5F5F5',
  textSecondary: '#B8BFCC',
  textTertiary: '#7A8290',
};

const fmtData = (iso?: string) => {
  if (!iso) return '—';
  const d = iso.length === 10 ? new Date(`${iso}T00:00:00`) : new Date(iso);
  return d.toLocaleDateString('pt-BR');
};

const diasEntre = (inicio?: string, fim?: string) => {
  if (!inicio || !fim) return null;
  const a = inicio.length === 10 ? new Date(`${inicio}T00:00:00`) : new Date(inicio);
  return Math.max(0, Math.round((new Date(fim).getTime() - a.getTime()) / 86400000));
};

export default function ImplantacoesConcluidasPage() {
  const { isDark } = useTheme();
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  const { data: implantacoes, update } = useTable<Implantacao>('implantacoes');
  const [q, setQ] = useState('');
  const [aberta, setAberta] = useState<string | null>(null);

  const concluidas = implantacoes
    .filter(i => i.etapa === ETAPA_CONCLUIDA)
    .sort((a, b) => (b.etapa_desde || '').localeCompare(a.etapa_desde || ''));

  const busca = q.trim().toLowerCase();
  const lista = concluidas.filter(
    i => !busca || [i.revenda, i.codigo, i.cidade, i.cnpj].some(v => (v || '').toLowerCase().includes(busca))
  );

  const agora = new Date();
  const noMes = concluidas.filter(i => {
    if (!i.etapa_desde) return false;
    const d = new Date(i.etapa_desde);
    return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
  }).length;
  const duracoes = concluidas.map(i => diasEntre(i.data_ingresso || i.created_at, i.etapa_desde)).filter((d): d is number => d !== null);
  const media = duracoes.length ? Math.round(duracoes.reduce((s, d) => s + d, 0) / duracoes.length) : null;

  const reabrir = async (c: Implantacao, etapa: string) => {
    const nome = STAGES.find(s => s.id === etapa)?.nome;
    if (!c.id || !window.confirm(`Reabrir "${c.revenda}" na etapa "${nome}"? Ela volta para o quadro de implantações.`)) return;
    await update(c.id, { etapa, status: statusFor(etapa), etapa_desde: new Date().toISOString() });
  };

  const card = (label: string, value: React.ReactNode, foot: string, accent?: string) => (
    <div style={{ background: theme.cardBg, border: `1px solid ${accent || theme.borderColor}`, borderRadius: '18px', padding: '20px' }}>
      <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>{label}</p>
      <div style={{ fontSize: '32px', fontWeight: 700, color: accent || theme.textPrimary }}>{value}</div>
      <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '8px 0 0 0' }}>{foot}</p>
    </div>
  );

  const campo = (label: string, valor?: React.ReactNode) => (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textTertiary, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: theme.textPrimary }}>{valor || '—'}</div>
    </div>
  );

  return (
    <PlatformLayout currentPage="implantacoes">
      <div style={{ padding: '24px', background: theme.background, minHeight: '100vh' }}>
        <Link href="/platform/implantacoes" style={{ fontSize: '13px', fontWeight: 600, color: theme.textSecondary, textDecoration: 'none' }}>
          ← Voltar para Implantações
        </Link>

        <div style={{ margin: '12px 0 20px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Implantações concluídas</h2>
          <p style={{ fontSize: '13.5px', color: theme.textSecondary, margin: '4px 0 0' }}>
            Revendas que chegaram em Ativou 3 clientes · {concluidas.length} no total.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {card('Concluídas', concluidas.length, 'no total', '#4E8E5B')}
          {card('Concluídas no mês', noMes, agora.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))}
          {card('Tempo médio de implantação', media === null ? '—' : `${media}d`, 'do ingresso até a conclusão')}
        </div>

        <input
          placeholder="Pesquisar por revenda, código, cidade ou CNPJ..."
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '520px',
            padding: '10px 12px',
            background: theme.cardBg,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '10px',
            color: theme.textPrimary,
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            marginBottom: '16px',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '18px', overflow: 'hidden' }}>
          {lista.length === 0 ? (
            <p style={{ margin: 0, padding: '40px 24px', textAlign: 'center', fontSize: '14px', color: theme.textTertiary }}>
              {concluidas.length === 0 ? 'Nenhuma implantação concluída ainda.' : 'Nenhuma revenda concluída encontrada para essa busca.'}
            </p>
          ) : (
            lista.map((c, i) => {
              const dias = diasEntre(c.data_ingresso || c.created_at, c.etapa_desde);
              const expandida = aberta === c.id;
              const prio = PRIORIDADES[c.prioridade] || PRIORIDADES.normal;
              return (
                <div key={c.id} style={{ borderBottom: i < lista.length - 1 ? `1px solid ${theme.borderColor}` : 'none' }}>
                  <div
                    onClick={() => setAberta(expandida ? null : c.id || null)}
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', cursor: 'pointer', flexWrap: 'wrap', background: expandida ? theme.background : 'transparent' }}
                  >
                    <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: theme.textPrimary }}>
                        {c.codigo ? `${c.codigo} · ` : ''}
                        {c.revenda}
                      </div>
                      <div style={{ fontSize: '13px', color: theme.textSecondary, marginTop: '2px' }}>
                        {[c.cidade && c.uf ? `${c.cidade}/${c.uf}` : '', c.produto, c.responsavel && `👤 ${c.responsavel}`].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#4E8E5B' }}>✓ Concluída em {fmtData(c.etapa_desde)}</div>
                      <div style={{ fontSize: '12px', color: theme.textTertiary, marginTop: '2px' }}>{dias === null ? '' : `${dias} dias de implantação`}</div>
                    </div>
                    <span style={{ color: theme.textTertiary, fontSize: '12px', transform: expandida ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </div>

                  {expandida && (
                    <div style={{ padding: '4px 20px 20px', background: theme.background }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        {campo('CNPJ', c.cnpj)}
                        {campo('E-mail', c.email)}
                        {campo('Telefone', c.telefone)}
                        {campo('Responsável da revenda', [c.contato, c.cargo].filter(Boolean).join(' · '))}
                        {campo('Segmento', c.segmento)}
                        {campo('Porte', c.porte)}
                        {campo('Nº de vendedores', c.vendedores)}
                        {campo('Qtd. contratos', c.contratos)}
                        {campo('Curva', c.curva)}
                        {campo('Prioridade', <span style={{ color: prio.c, fontWeight: 600 }}>{prio.label}</span>)}
                        {campo('Data de ingresso', fmtData(c.data_ingresso))}
                        {campo('Data de aniversário', fmtData(c.data_aniversario))}
                      </div>
                      {c.observacoes && <div style={{ marginBottom: '16px' }}>{campo('Observações', <span style={{ whiteSpace: 'pre-wrap' }}>{c.observacoes}</span>)}</div>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '12px', borderTop: `1px solid ${theme.borderColor}` }}>
                        <span style={{ fontSize: '13px', color: theme.textSecondary }}>Reabrir implantação na etapa:</span>
                        <select
                          value=""
                          onChange={e => e.target.value && reabrir(c, e.target.value)}
                          style={{ padding: '8px 10px', background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '13px', fontFamily: 'inherit' }}
                        >
                          <option value="">Selecione...</option>
                          {STAGES.filter(s => s.id !== ETAPA_CONCLUIDA).map(s => (
                            <option key={s.id} value={s.id}>{s.nome}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}
