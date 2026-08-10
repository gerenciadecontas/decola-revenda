'use client';

import { GestorLayout } from '@/app/components/GestorLayout';

const COLORS = {
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
  purple: '#8B5CF6',
  yellow: '#FFC93C',
  green: '#34D399',
};

const servicos = [
  {
    icon: '💳',
    titulo: 'LC Pay',
    desc: 'Solução de pagamento integrada',
    status: 'Ativo',
    badge: 'Premium'
  },
  {
    icon: '📱',
    titulo: 'Força de Vendas',
    desc: 'Gerenciamento de força de vendas',
    status: 'Ativo',
    badge: 'Pro'
  },
  {
    icon: '🍽️',
    titulo: 'LC Gourmet',
    desc: 'Solução para restaurantes',
    status: 'Ativo',
    badge: 'Especial'
  },
  {
    icon: '🏪',
    titulo: 'LC Balcão',
    desc: 'Automação de balcão',
    status: 'Ativo',
    badge: 'Premium'
  },
  {
    icon: '📊',
    titulo: 'LC Dashboard',
    desc: 'Dashboards avançados',
    status: 'Disponível',
    badge: 'Plus'
  },
  {
    icon: '📦',
    titulo: 'Coletor de Dados',
    desc: 'Coleta de dados móvel',
    status: 'Ativo',
    badge: 'Pro'
  },
];

export default function ServicosPage() {
  return (
    <GestorLayout currentPage="servicos">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
            Serviços Adicionais
          </h1>
          <p style={{ color: COLORS.textSecondary, margin: 0 }}>
            Conheça todos os serviços e integrações disponíveis para sua revenda
          </p>
        </div>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {servicos.map((servico, idx) => (
            <div
              key={idx}
              style={{
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.borderColor}`,
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.purple;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.borderColor;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Icon and Badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '48px' }}>{servico.icon}</div>
                <span
                  style={{
                    background: COLORS.purple,
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {servico.badge}
                </span>
              </div>

              {/* Title and Description */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: COLORS.textPrimary, margin: '0 0 6px 0' }}>
                  {servico.titulo}
                </h3>
                <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: 0 }}>
                  {servico.desc}
                </p>
              </div>

              {/* Status and Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: COLORS.green,
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.green }}></span>
                  {servico.status}
                </span>
                <button
                  style={{
                    background: COLORS.purple,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#7c3aed')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.purple)}
                >
                  Saiba Mais
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GestorLayout>
  );
}
