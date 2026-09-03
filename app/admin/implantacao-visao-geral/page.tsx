'use client';

import { GestorLayout } from '@/app/components/GestorLayout';
import { useTheme } from '@/app/context/ThemeContext';
import { ChevronRight } from 'lucide-react';

const LIGHT_COLORS = {
  background: '#F8F6F1',
  cardBackground: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#888888',
  borderColor: '#E8E1D5',
  purple: '#7C5CF0',
  purple_light: '#E8E3F5',
  yellow: '#F5A623',
  yellow_light: '#FFF0E0',
  blue_light: '#E8E6F8',
  blue_dark: '#6B5FA3',
  green: '#52C77C',
  green_light: '#E8F7EF',
};

export default function ImplantacaoVisaoGeralPage() {
  const { isDark, colors: themeColors } = useTheme();
  const colors = isDark ? themeColors : LIGHT_COLORS;

  const kpis = [
    {
      label: 'Revendas em implantação',
      value: '12',
      subtitle: 'entraram esta semana',
      changeValue: '+2',
      color: '#7C5CF0',
    },
    {
      label: 'Em risco',
      value: '3',
      subtitle: 'paradas há 5+ dias',
      tag: 'atenção',
      color: '#F5A623',
    },
    {
      label: 'Ciclo médio',
      value: '18d',
      subtitle: 'meta: 15 dias',
      changeValue: '-2d',
      color: '#5B4B9F',
    },
    {
      label: 'Go-live no mês',
      value: '8',
      subtitle: 'taxa de conclusão',
      percent: '89%',
      color: '#888888',
    },
  ];

  const onboardingFunnel = [
    { stage: 'Chegada', count: 2, daysInStage: '2d', color: '#F5A623' },
    { stage: 'Boas-vindas', count: 3, daysInStage: '4d', color: '#A4A8B3' },
    { stage: 'Sem retorno', count: 2, daysInStage: '9d', color: '#F5A623' },
    { stage: 'Go-Live', count: 1, daysInStage: '1d', color: '#5B4B9F' },
  ];

  const actionItems = [
    {
      title: 'Papelaria Central',
      subtitle: '3 tentativas de contato sem retorno',
      action: 'Ligar',
      actionColor: '#4A90E2',
      dotColor: '#F5A623',
    },
    {
      title: 'Casa do Pintor',
      subtitle: 'Parada há 9 dias em Sem retorno',
      action: 'Escalar',
      actionColor: '#E2944A',
      dotColor: '#F5A623',
    },
    {
      title: 'Auto Peças Bandeirantes',
      subtitle: 'Treinamento pediu reagendamento',
      action: 'Reagendar',
      actionColor: '#7C5CF0',
      dotColor: '#F5A623',
    },
    {
      title: 'Ferragem Sul',
      subtitle: 'Cadastro fiscal incompleto',
      action: 'Cobrar dados',
      actionColor: '#D9534F',
      dotColor: '#F5A623',
    },
  ];

  return (
    <GestorLayout currentPage="implantacoes">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${isDark ? '#2D3038' : '#E8E1D5'}` }}>
          <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '12px' }}>
            Implantação / <span style={{ color: colors.textPrimary, fontWeight: 500 }}>Visão geral</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
                Visão geral
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                padding: '8px 16px',
                border: `1px solid ${isDark ? colors.borderColor : '#E8E1D5'}`,
                background: isDark ? colors.cardBackground : '#FFFFFF',
                borderRadius: '8px',
                color: colors.textPrimary,
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}>
                Exportar
              </button>
              <button style={{
                padding: '8px 16px',
                border: 'none',
                background: '#7C5CF0',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                + Nova revenda
              </button>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '0' }}>
            Saúde da carteira de implantação · atualizado há 2 min
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {kpis.map((kpi, i) => {
            let bgColor = isDark ? colors.cardBackground : '#FFFFFF';
            if (!isDark) {
              if (i === 1) bgColor = 'rgba(245, 166, 35, 0.1)';
              else if (i === 2) bgColor = 'rgba(123, 92, 240, 0.08)';
              else if (i === 3) bgColor = '#F5F5F5';
            }
            return (
            <div
              key={i}
              style={{
                background: bgColor,
                border: `1px solid ${isDark ? colors.borderColor : (i === 1 ? '#F5A623' : i === 2 ? '#5B43C0' : '#E8E1D5')}`,
                borderRadius: '12px',
                padding: '20px',
                boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: colors.textSecondary }}>
                  {kpi.label}
                </div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: isDark ? `${kpi.color}22` : (kpi.color === '#7C5CF0' ? LIGHT_COLORS.purple_light : kpi.color === '#F5A623' ? LIGHT_COLORS.yellow_light : LIGHT_COLORS.blue_light),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: kpi.color,
                    fontSize: '20px',
                  }}
                >
                  ●
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: colors.textPrimary, marginBottom: '8px' }}>
                {kpi.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: colors.textSecondary }}>
                {kpi.tag && (
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: isDark ? `${kpi.color}22` : LIGHT_COLORS.yellow_light,
                      color: kpi.color,
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {kpi.tag}
                  </span>
                )}
                {kpi.changeValue && <span style={{ fontWeight: 600 }}>{kpi.changeValue}</span>}
                {kpi.percent && <span style={{ fontWeight: 600 }}>{kpi.percent}</span>}
                <span>{kpi.subtitle}</span>
              </div>
            </div>
            );
          })}
        </div>

        {/* Funil de Onboarding + Precisa de Ação */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Funil de Onboarding */}
        <div
          style={{
            background: isDark ? colors.cardBackground : '#FFFFFF',
            border: `1px solid ${isDark ? colors.borderColor : '#E8E1D5'}`,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, margin: 0 }}>
              Funil de onboarding
            </h3>
            <a href="#" style={{ fontSize: '13px', fontWeight: 500, color: '#7C5CF0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Abrir kanban <ChevronRight size={16} />
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {onboardingFunnel.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ minWidth: '80px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: colors.textSecondary, marginBottom: '4px' }}>
                    ● {item.stage}
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      height: '32px',
                      borderRadius: '6px',
                      background: isDark ? '#23262C' : '#F0E8DC',
                      flex: 1,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '6px',
                        width: `${(item.count / 3) * 100}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                  <div style={{ minWidth: '40px', fontSize: '13px', fontWeight: 600, color: colors.textPrimary }}>
                    {item.count}
                  </div>
                  <div style={{ minWidth: '60px', fontSize: '12px', color: colors.textSecondary, textAlign: 'right' }}>
                    {item.daysInStage} na etapa
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '6px',
              background: isDark ? 'rgba(139,92,246,0.08)' : '#F0E8F6',
              fontSize: '12px',
              color: colors.textSecondary,
            }}
          >
            💡 Isso permite identificar onde as revendas estão ficando presas. Se muitas ficam entre treinamento e conclusão, pode haver um problema nessa etapa.
          </div>
        </div>

        {/* Precisa de Ação */}
        <div
          style={{
            background: isDark ? colors.cardBackground : '#FFFFFF',
            border: `1px solid ${isDark ? colors.borderColor : '#E8E1D5'}`,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, margin: 0 }}>
              Precisa de ação
            </h3>
            <div
              style={{
                background: isDark ? '#F5A62322' : LIGHT_COLORS.yellow_light,
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#F5A623',
              }}
            >
              4 items
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {actionItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '12px',
                  borderBottom: i < actionItems.length - 1 ? `1px solid ${isDark ? '#2D3038' : '#E5DFD3'}` : 'none',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: colors.textPrimary,
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ color: item.dotColor }}>●</span>
                    {item.title}
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: colors.textSecondary }}>
                    {item.subtitle}
                  </p>
                </div>
                <a
                  href="#"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: item.actionColor,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    marginLeft: '12px',
                  }}
                >
                  {item.action}
                </a>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </GestorLayout>
  );
}
