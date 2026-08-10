'use client';
import { PlatformLayout } from '@/app/components/PlatformLayout';
const COLORS = { cardBg: '#16181D', borderColor: '#23262C', textPrimary: '#E8EAED', textSecondary: '#9AA1AA' };
export default function AgentesPage() {
  return <PlatformLayout currentPage="agentes"><div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '48px 24px', textAlign: 'center', color: COLORS.textSecondary }}><div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div><h2 style={{ fontSize: '24px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '8px' }}>Agentes</h2><p>Gerencie os agentes de canal</p></div></PlatformLayout>;
}
