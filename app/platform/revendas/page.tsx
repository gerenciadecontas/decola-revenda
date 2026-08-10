'use client';

import { useState } from 'react';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { mockRevendas } from '@/app/data/mockData';
import { ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';

const COLORS = {
  darkBg: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
  purple: '#8B5CF6',
  green: '#34D399',
  red: '#F87171',
};

export default function RevendasPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRevendas = mockRevendas.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    'em-implantacao': '#8B5CF6',
    'em-treinamento': '#FFC93C',
    'concluida': '#34D399',
    'atrasada': '#F87171',
  };

  return (
    <PlatformLayout currentPage="revendas">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '12px 16px' }}>
          <Search size={20} style={{ color: COLORS.textSecondary }} />
          <input
            type="text"
            placeholder="Buscar por revendas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: COLORS.textPrimary,
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {/* Table */}
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '16px 24px', background: 'rgba(0,0,0,0.2)', borderBottom: `1px solid ${COLORS.borderColor}`, fontSize: '12px', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            <div>Revenda</div>
            <div>Cidade</div>
            <div>Responsável</div>
            <div>Status</div>
            <div>Ação</div>
          </div>

          {filteredRevendas.map((revenda) => (
            <div
              key={revenda.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                gap: '16px',
                alignItems: 'center',
                padding: '16px 24px',
                borderBottom: `1px solid ${COLORS.borderColor}`,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ color: COLORS.textPrimary, fontWeight: 500 }}>{revenda.name}</div>
              <div style={{ color: COLORS.textSecondary, fontSize: '14px' }}>{revenda.city}</div>
              <div style={{ color: COLORS.textSecondary, fontSize: '14px' }}>{revenda.responsable.name}</div>
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: statusColors[revenda.status] || COLORS.borderColor,
                  color: revenda.status === 'concluida' ? COLORS.cardBg : COLORS.textPrimary,
                  width: 'fit-content',
                }}
              >
                {revenda.status === 'em-implantacao' ? 'Implantação' : revenda.status === 'em-treinamento' ? 'Treinamento' : revenda.status === 'concluida' ? 'Concluída' : 'Atrasada'}
              </div>
              <Link
                href={`/platform/revendas/${revenda.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.purple, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}
              >
                Ver <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {filteredRevendas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: COLORS.textSecondary }}>
            Nenhuma revenda encontrada
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
