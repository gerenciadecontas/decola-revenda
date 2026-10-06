'use client';

import { useCallback, useEffect, useState } from 'react';

// Supabase project is currently unreachable and has no implantacoes table, so data lives in localStorage.
export function useLocalTable<T extends { id?: string; created_at?: string; updated_at?: string }>(tableName: string) {
  const key = `${tableName}-list`;
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setData(JSON.parse(stored));
    } catch {}
  }, [key]);

  const persist = useCallback((updater: (items: T[]) => T[]) => {
    setData(prev => {
      const next = updater(prev);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [key]);

  const create = async (item: Omit<T, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString(), created_at: new Date().toISOString() } as T;
    persist(items => [...items, newItem]);
    return newItem;
  };

  const update = async (id: string, patch: Partial<T>) => {
    persist(items => items.map(i => (i.id === id ? { ...i, ...patch, updated_at: new Date().toISOString() } : i)));
  };

  const delete_ = async (id: string) => {
    persist(items => items.filter(i => i.id !== id));
  };

  return { data, create, update, delete_ };
}
