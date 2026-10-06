'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { supabase } from '@/lib/supabase/client';

const LIGHT = { background: '#F9F7F4', cardBg: '#FFFFFF', border: '#E8E4DC', text: '#1A1A1A', muted: '#6B6B6B', input: '#F9F7F4' };
const DARK = { background: '#0E1013', cardBg: '#16181D', border: '#2A2D33', text: '#F5F5F5', muted: '#B8BFCC', input: '#0E1013' };

const ERROS: Record<string, string> = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Este e-mail ainda não foi confirmado. Peça para o administrador confirmar o usuário no Supabase.',
};

export default function LoginPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const t = isDark ? DARK : LIGHT;
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/platform/dashboard');
    });
  }, [router]);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    if (!email.trim() || !senha) return setErro('Informe e-mail e senha.');
    setEntrando(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setEntrando(false);
    if (error) return setErro(ERROS[error.message] || `Não foi possível entrar: ${error.message}`);
    router.replace('/platform/dashboard');
  };

  const input: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: t.input,
    border: `1px solid ${t.border}`,
    borderRadius: '10px',
    color: t.text,
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };
  const label: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: t.muted, display: 'block', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: t.background, padding: '24px', fontFamily: '"Sora", sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');`}</style>
      <form
        onSubmit={entrar}
        style={{ width: '100%', maxWidth: '400px', background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '18px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#E6B23E', display: 'grid', placeItems: 'center', fontWeight: 700, color: '#1A1A1A', fontSize: '22px' }}>
            D
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: t.text }}>Decola</div>
            <div style={{ fontSize: '10px', color: t.muted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Central de implantação</div>
          </div>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: t.text, margin: '0 0 6px' }}>Entrar</h1>
        <p style={{ fontSize: '13px', color: t.muted, margin: '0 0 24px' }}>Use o e-mail e a senha cadastrados para a equipe.</p>

        <div style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label style={label} htmlFor="email">E-mail</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@lcsistemas.com.br" style={input} autoFocus />
          </div>
          <div>
            <label style={label} htmlFor="senha">Senha</label>
            <input id="senha" type="password" autoComplete="current-password" value={senha} onChange={e => setSenha(e.target.value)} style={input} />
          </div>

          {erro && (
            <div role="alert" style={{ background: 'rgba(217, 83, 79, 0.12)', color: '#D9534F', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={entrando}
            style={{ marginTop: '6px', padding: '12px', background: '#E6B23E', border: 'none', borderRadius: '10px', color: '#1A1A1A', cursor: entrando ? 'wait' : 'pointer', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit', opacity: entrando ? 0.7 : 1 }}
          >
            {entrando ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  );
}
