'use client';
import { GestorLayout } from '@/app/components/GestorLayout';
const COLORS = { cardBg: '#16181D', borderColor: '#23262C', textPrimary: '#E8EAED', textSecondary: '#9AA1AA' };
export default function AlertasPage() {
  return (
    <GestorLayout currentPage="alertas">
      <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '48px 24px', textAlign: 'center', color: COLORS.textSecondary }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔔</div>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '8px' }}>Alertas</h2>
        <p>Visualize os alertas do sistema</p>
      </div>
    </GestorLayout>
  );
}
