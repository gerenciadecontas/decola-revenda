'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';

export default function HomePage() {
  const router = useRouter();
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.darkBg }}>
        <p style={{ color: colors.textPrimary }}>Inicializando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: colors.darkBg, gap: '40px', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&display=swap');
      `}</style>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: `linear-gradient(150deg, ${colors.purple}, #6D28D9)`,
          display: 'grid',
          placeItems: 'center',
          fontFamily: '"Sora", sans-serif',
          fontWeight: 700,
          color: '#fff',
          fontSize: '32px',
          marginBottom: '16px',
          margin: '0 auto 16px'
        }}>
          D
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: 700, color: colors.textPrimary, margin: '0', letterSpacing: '-0.02em' }}>
          Decola Revenda
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={() => router.push('/admin/dashboard')}
          style={{
            padding: '16px 32px',
            background: colors.purple,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#7C3AED';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.purple;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          👨‍💼 Gestor
        </button>
        <button
          onClick={() => router.push('/platform/dashboard')}
          style={{
            padding: '16px 32px',
            background: colors.purple,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#7C3AED';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.purple;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🚀 Agente de Canal
        </button>
      </div>
    </div>
  );
}
