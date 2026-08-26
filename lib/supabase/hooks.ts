import { supabase } from './client';

const hasSupabase = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

// Generic CRUD hooks for any table
export const useSupabaseTable = (tableName: string) => {
  const getAll = async () => {
    if (!hasSupabase()) {
      const stored = localStorage.getItem(`${tableName}-list`);
      return stored ? JSON.parse(stored) : [];
    }
    
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return [];
    }
    return data || [];
  };

  const create = async (item: any) => {
    if (!hasSupabase()) {
      const items = await getAll();
      const newItem = { ...item, id: Date.now().toString() };
      const updated = [...items, newItem];
      localStorage.setItem(`${tableName}-list`, JSON.stringify(updated));
      return newItem;
    }

    const { data, error } = await supabase.from(tableName).insert([item]).select();
    if (error) {
      console.error(`Error creating ${tableName}:`, error);
      return null;
    }
    return data?.[0] || null;
  };

  const update = async (id: string, item: any) => {
    if (!hasSupabase()) {
      const items = await getAll();
      const updated = items.map((i: any) => i.id === id ? { ...i, ...item } : i);
      localStorage.setItem(`${tableName}-list`, JSON.stringify(updated));
      return { ...items.find((i: any) => i.id === id), ...item };
    }

    const { data, error } = await supabase.from(tableName).update(item).eq('id', id).select();
    if (error) {
      console.error(`Error updating ${tableName}:`, error);
      return null;
    }
    return data?.[0] || null;
  };

  const delete_ = async (id: string) => {
    if (!hasSupabase()) {
      const items = await getAll();
      const updated = items.filter((i: any) => i.id !== id);
      localStorage.setItem(`${tableName}-list`, JSON.stringify(updated));
      return true;
    }

    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      console.error(`Error deleting ${tableName}:`, error);
      return false;
    }
    return true;
  };

  return { getAll, create, update, delete_ };
};
