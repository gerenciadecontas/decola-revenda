import { createClient } from './supabase/server';

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Erro ao buscar profile:', error);
      return null;
    }
    return profile;
  } catch (err) {
    console.error('Erro inesperado em getUserProfile:', err);
    return null;
  }
}

export async function isAdmin() {
  const profile = await getUserProfile();
  return profile?.role === 'admin';
}

export async function isGestor() {
  const profile = await getUserProfile();
  return profile?.role === 'gestor';
}
