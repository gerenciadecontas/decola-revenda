'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toRow } from '@/lib/supabase/hooks';
import { useTheme } from '@/app/context/ThemeContext';

// Data saved in this browser before the platform used Supabase.
const LEGACY = {
  implantacoes: 'implantacoes-list',
  lives: 'jornada-lives-list',
  sessoes: 'jornada-treinamentos-agenda-list',
  custom: 'jornada-treinamentos-custom',
  progresso: 'jornada-treinamentos-progress',
};

const COLUNAS = {
  implantacoes: [
    'codigo', 'revenda', 'cnpj', 'cidade', 'uf', 'email', 'telefone', 'contato', 'cargo', 'situacao', 'segmento', 'porte',
    'vendedores', 'data_ingresso', 'data_aniversario', 'contratos', 'curva', 'etapa', 'prioridade', 'produto', 'responsavel',
    'data_prevista', 'observacoes', 'status', 'etapa_desde', 'created_at',
  ],
  lives: ['tema', 'data', 'hora', 'duracao', 'apresentador', 'modulo', 'link', 'descricao', 'status', 'created_at'],
  sessoes: ['modulo', 'dia', 'titulo', 'data', 'hora', 'duracao', 'revenda', 'instrutor', 'link', 'observacoes', 'status', 'created_at'],
};

const ler = <T,>(key: string, vazio: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || '') ?? vazio;
  } catch {
    return vazio;
  }
};

const pick = (item: Record<string, unknown>, cols: string[]) =>
  toRow(Object.fromEntries(cols.filter(c => c in item).map(c => [c, item[c]])), ['created_at']);

type Pendente = {
  implantacoes: Record<string, unknown>[];
  lives: Record<string, unknown>[];
  sessoes: Record<string, unknown>[];
  custom: { modulo: string; dia: number; title: string; obj: string; temas: string[] }[];
  progresso: string[];
};

const carregarPendente = (): Pendente => {
  const customMap = ler<Record<string, { day: number; title: string; obj: string; temas: string[] }[]>>(LEGACY.custom, {});
  const progressMap = ler<Record<string, boolean>>(LEGACY.progresso, {});
  return {
    implantacoes: ler(LEGACY.implantacoes, []),
    lives: ler(LEGACY.lives, []),
    sessoes: ler(LEGACY.sessoes, []),
    custom: Object.entries(customMap).flatMap(([modulo, items]) =>
      (items || []).map(i => ({ modulo, dia: i.day, title: i.title, obj: i.obj || '', temas: i.temas || [] }))
    ),
    progresso: Object.entries(progressMap).filter(([, v]) => v).map(([k]) => k),
  };
};

export function LegacyImport() {
  const { colors } = useTheme();
  const [pendente, setPendente] = useState<Pendente | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    setPendente(carregarPendente());
  }, []);

  if (!pendente || oculto) return null;
  const total = pendente.implantacoes.length + pendente.lives.length + pendente.sessoes.length + pendente.custom.length + pendente.progresso.length;
  if (total === 0) return null;

  const resumo = [
    pendente.implantacoes.length && `${pendente.implantacoes.length} implantações`,
    pendente.lives.length && `${pendente.lives.length} lives`,
    pendente.sessoes.length && `${pendente.sessoes.length} treinamentos agendados`,
    pendente.custom.length && `${pendente.custom.length} treinamentos adicionados`,
    pendente.progresso.length && `${pendente.progresso.length} temas marcados`,
  ]
    .filter(Boolean)
    .join(', ');

  const enviar = async () => {
    setEnviando(true);
    setErro('');
    const passos: [string, () => PromiseLike<{ error: { message: string } | null }>][] = [
      ['implantações', () => supabase.from('implantacoes').insert(pendente.implantacoes.map(i => pick(i, COLUNAS.implantacoes)))],
      ['lives', () => supabase.from('jornada_lives').insert(pendente.lives.map(i => pick(i, COLUNAS.lives)))],
      ['treinamentos agendados', () => supabase.from('jornada_sessoes').insert(pendente.sessoes.map(i => pick(i, COLUNAS.sessoes)))],
      ['treinamentos adicionados', () => supabase.from('jornada_treinamentos_custom').upsert(pendente.custom, { onConflict: 'modulo,dia', ignoreDuplicates: true })],
      ['temas marcados', () => supabase.from('jornada_progresso').upsert(pendente.progresso.map(tema_key => ({ tema_key })), { onConflict: 'tema_key', ignoreDuplicates: true })],
    ];
    const chaves = [LEGACY.implantacoes, LEGACY.lives, LEGACY.sessoes, LEGACY.custom, LEGACY.progresso];
    const vazios = [pendente.implantacoes, pendente.lives, pendente.sessoes, pendente.custom, pendente.progresso].map(l => l.length === 0);

    for (let i = 0; i < passos.length; i++) {
      if (vazios[i]) continue;
      const [nome, rodar] = passos[i];
      const { error } = await rodar();
      if (error) {
        setErro(`Erro ao enviar ${nome}: ${error.message}. Nada foi apagado do navegador.`);
        setEnviando(false);
        return;
      }
      // Keep a backup copy so nothing is lost if the import ever needs to be checked.
      localStorage.setItem(`${chaves[i]}-backup-migrado`, localStorage.getItem(chaves[i]) || '');
      localStorage.removeItem(chaves[i]);
    }
    window.location.reload();
  };

  return (
    <div
      role="status"
      style={{
        margin: '16px 32px 0',
        padding: '14px 18px',
        borderRadius: '12px',
        border: '1px solid #E6B23E',
        background: 'rgba(230, 178, 62, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        fontFamily: '"Sora", sans-serif',
      }}
    >
      <div style={{ flex: '1 1 320px', fontSize: '13px', color: colors.textPrimary }}>
        <strong>Há dados salvos só neste navegador:</strong> {resumo}. Envie para o banco para não perdê-los e para a equipe ver.
        {erro && <div style={{ color: '#D9534F', fontWeight: 600, marginTop: '6px' }}>{erro}</div>}
      </div>
      <button
        onClick={() => setOculto(true)}
        disabled={enviando}
        style={{ background: 'transparent', border: 'none', color: colors.textSecondary, cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}
      >
        Agora não
      </button>
      <button
        onClick={enviar}
        disabled={enviando}
        style={{ padding: '9px 16px', background: '#E6B23E', border: 'none', borderRadius: '10px', color: '#1A1A1A', cursor: enviando ? 'wait' : 'pointer', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit' }}
      >
        {enviando ? 'Enviando...' : 'Enviar para o banco'}
      </button>
    </div>
  );
}
