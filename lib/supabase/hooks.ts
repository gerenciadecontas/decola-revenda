'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from './client';

const READONLY_FIELDS = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by'];

// Empty strings from forms become NULL so date/number columns accept them.
export const toRow = (item: Record<string, unknown>, keep: string[] = []) =>
  Object.fromEntries(
    Object.entries(item)
      .filter(([k, v]) => v !== undefined && (keep.includes(k) || !READONLY_FIELDS.includes(k)))
      .map(([k, v]) => [k, v === '' ? null : v])
  );

const fail = (acao: string, message: string): never => {
  window.alert(`Não foi possível ${acao}. ${message}`);
  throw new Error(message);
};

export function useTable<T extends Record<string, any>>(table: string, key: string = 'id') {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data: rows, error }) => {
        if (!active) return;
        if (error) console.error(`Erro ao carregar ${table}:`, error.message);
        setData((rows as T[]) || []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [table]);

  const create = useCallback(
    async (item: Partial<T>) => {
      const { data: row, error } = await supabase.from(table).insert(toRow(item, key === 'id' ? [] : [key])).select().single();
      if (error) return fail('salvar', error.message);
      setData(prev => [...prev, row as T]);
      return row as T;
    },
    [table, key]
  );

  const update = useCallback(
    async (id: string, patch: Partial<T>) => {
      const { data: row, error } = await supabase.from(table).update(toRow(patch)).eq(key, id).select().single();
      if (error) return fail('salvar a alteração', error.message);
      setData(prev => prev.map(i => (i[key] === id ? (row as T) : i)));
    },
    [table, key]
  );

  const delete_ = useCallback(
    async (id: string) => {
      const { error } = await supabase.from(table).delete().eq(key, id);
      if (error) return fail('excluir', error.message);
      setData(prev => prev.filter(i => i[key] !== id));
    },
    [table, key]
  );

  return { data, loading, create, update, delete_ };
}
