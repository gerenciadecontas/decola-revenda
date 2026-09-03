'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { useState, useEffect } from 'react';
import '@/app/globals.css';

const LIGHT_THEME = {
  background: '#F9F7F4',
  cardBg: '#FFFFFF',
  borderColor: '#E8E4DC',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#A0A0A0',
  purple: '#7C5CF0',
  yellow: '#E6B23E',
};

const DARK_THEME = {
  background: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#2A2D33',
  textPrimary: '#F5F5F5',
  textSecondary: '#B8BFCC',
  textTertiary: '#7A8290',
  purple: '#9D7EFF',
  yellow: '#F5C947',
};

const TREINAMENTOS_DATA = {
  lcweb: {
    label: 'LC WEB',
    days: 10,
    temas: 73,
    items: [
      {
        day: 1,
        title: 'Cadastro de Produtos',
        obj: 'Dominar o cadastro, edição e organização de produtos – a tela mais acessada do sistema.',
        temas: ['Cadastro/Produto', 'Cadastro/Categoria', 'Cadastro/Subcategoria', 'Cadastro/Unidade', 'Cadastro/Grade de Produtos', 'Cadastro/Tabela de Preços', 'Cadastro/Promoção']
      },
      {
        day: 2,
        title: 'Vendas',
        obj: 'Operar PDV, balcão, pedidos, retaguarda de vendas e devoluções.',
        temas: ['Venda/PDV', 'Venda/Balcão', 'Venda/Retaguarda', 'Venda/Devolução', 'Venda/Pedido de Venda']
      },
      {
        day: 3,
        title: 'Cadastro de Pessoas',
        obj: 'Cadastrar e gerenciar clientes, funcionários, fornecedores e permissões de usuário.',
        temas: ['Cadastro/Cliente', 'Cadastro/Funcionário', 'Cadastro/Fornecedor', 'Cadastro/Função do Usuário', 'Cadastro/Contabilista', 'Cadastro/Fabricante']
      },
      {
        day: 4,
        title: 'Estoque',
        obj: 'Controlar entrada, saída, ajustes e transferências de estoque, incluindo importação de XML.',
        temas: ['Estoque/Entrada', 'Estoque/Ajuste de Estoque', 'Estoque/Importação de XML', 'Estoque/Saída', 'Estoque/Transferência entre Empresas', 'Estoque/Transferência Local', 'Cadastro/Local de Estoque']
      },
      {
        day: 5,
        title: 'Financeiro',
        obj: 'Gerenciar contas a pagar/receber, fluxo de caixa (DFC), DRE e crédito.',
        temas: ['Financeiro/Contas a Receber', 'Financeiro/Contas a Pagar', 'Financeiro/DFC', 'Financeiro/Carta de Crédito', 'Financeiro/DRE', 'Cadastro/Caixa']
      },
      {
        day: 6,
        title: 'Cadastros Fiscais e Tributários',
        obj: 'Configurar empresa, grupos de tributação, natureza de operação e cadastros fiscais de apoio.',
        temas: ['Cadastro/Empresa', 'Cadastro/Grupo de Tributação', 'Cadastro/Natureza da Operação', 'Cadastro/Forma de Pagamento', 'Cadastro/Plano de Contas', 'Cadastro/Centro de Custo']
      },
      {
        day: 7,
        title: 'Fiscal – Emissão de Documentos',
        obj: 'Emitir e consultar NFe, NFCe e MDFe.',
        temas: ['Fiscal/NFe', 'Fiscal/NFCe', 'Fiscal/MDFe']
      },
      {
        day: 8,
        title: 'Relatórios e Dashboards',
        obj: 'Interpretar dashboards de vendas, caixa, financeiro, estoque e relatórios gerenciais.',
        temas: ['Dashboard/Vendas', 'Relatório/Vendas', 'Relatório/Caixa', 'Relatório/Estoque', 'Relatório/Financeiro', 'Relatório/Favoritos', 'Relatório/Fiscal', 'Dashboard/Financeiro a Receber', 'Dashboard/Financeiro a Pagar', 'Dashboard/Estoque', 'Relatório/Cadastros']
      },
      {
        day: 9,
        title: 'Configurações e Acesso',
        obj: 'Configurar o sistema, gerenciar acessos e autenticação.',
        temas: ['Acesso/Login', 'Configuração/Geral', 'Acesso/Cadastro de Usuário', 'Configuração/Rápida', 'Supervisão/Autorização Remota', 'Configuração/Sistema', 'Acesso/Negado', 'Acesso/Recuperar Senha', 'Configuração/Importar Dados']
      },
      {
        day: 10,
        title: 'Ferramentas Extras e Navegação Geral',
        obj: 'Apresentar etiquetas, IA, integrações, contabilidade e páginas de navegação geral.',
        temas: ['Navegação/Início', 'Navegação/Raiz', 'Etiqueta/Impressão', 'Navegação/Novidades', 'Etiqueta/Criar', 'Navegação/Comprovante', 'Etiqueta/Listagem', 'Contabilidade/Arquivos XML', 'IA/Chat', 'IA/Insights', 'Integração/LCPay', 'E-commerce/Catálogo Digital', 'Marketplace/Amazon']
      }
    ]
  },
  lcerp: {
    label: 'LC ERP Desktop',
    days: 4,
    temas: 20,
    items: [
      {
        day: 1,
        title: 'Vendas',
        obj: 'Operar PDV, atendimento no balcão e retaguarda de vendas.',
        temas: ['Venda/PDV', 'Venda/Atendimento Balcão', 'Venda/Retaguarda']
      },
      {
        day: 2,
        title: 'Cadastros',
        obj: 'Cadastrar produtos, clientes, empresas, usuários, formas de pagamento e contabilista.',
        temas: ['Cadastro/Produto', 'Cadastro/Cliente', 'Cadastro/Empresa', 'Cadastro/Usuário', 'Cadastro/Forma de Pagamento', 'Cadastro/Contabilista']
      },
      {
        day: 3,
        title: 'Estoque e Gestão',
        obj: 'Registrar entradas de estoque, acompanhar o dashboard, gerenciar multiempresa e configurar o PDV.',
        temas: ['Estoque/Entrada', 'Sistema/Dashboard', 'Sistema/Multiempresa', 'Configuração/PDV']
      },
      {
        day: 4,
        title: 'Fiscal',
        obj: 'Emitir e transmitir documentos fiscais e obrigações acessórias.',
        temas: ['Fiscal/NF-e', 'Fiscal/NFC-e', 'Fiscal/MD-e', 'Fiscal/MDF-e', 'Fiscal/CT-e', 'Fiscal/Sintegra', 'Fiscal/Sped']
      }
    ]
  },
  produtos: {
    label: 'Produtos',
    days: 1,
    temas: 8,
    items: [
      {
        day: 1,
        title: 'Portfólio de Produtos LC',
        obj: 'Conhecer os produtos e integrações do ecossistema LC vendidos junto com o ERP.',
        temas: ['Produto/LC Pay', 'Produto/LC Força de Vendas', 'Produto/LC Gourmet', 'Produto/LC Balcão', 'Produto/LC Dashboard', 'Produto/LC Coletor de Dados', 'Produto/Smart TEF', 'Produto/Imendes']
      }
    ]
  }
};

export default function JornadaCapacitacaoPage() {
  const { isDark } = useTheme();
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  const [mainTab, setMainTab] = useState('treinamentos');
  const [subTab, setSubTab] = useState('lcweb');
  const [expandedDays, setExpandedDays] = useState({ 1: true });
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('jornada-treinamentos-progress');
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, []);

  const handleCheck = (key: string) => {
    const newState = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newState);
    localStorage.setItem('jornada-treinamentos-progress', JSON.stringify(newState));
  };

  const toggleDay = (dayNum: number) => {
    setExpandedDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const currentData = TREINAMENTOS_DATA[subTab as keyof typeof TREINAMENTOS_DATA];

  return (
    <PlatformLayout currentPage="treinamentos">
      <div style={{ padding: '32px', background: theme.background, minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 8px 0' }}>
              Jornada de capacitação
            </h1>
            <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0 }}>
              24 sessões no trimestre · atualizado há 2 min
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: isDark ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.05)', padding: '8px', borderRadius: '12px', width: 'fit-content' }}>
          {['treinamentos', 'lives', 'acompanhamento'].map(tab => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              style={{
                border: 'none',
                background: mainTab === tab ? '#7C5CF0' : 'transparent',
                color: mainTab === tab ? '#fff' : theme.textSecondary,
                fontSize: '14px',
                fontWeight: '700',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {tab === 'treinamentos' ? 'Treinamentos' : tab === 'lives' ? 'Lives' : 'Acompanhamento'}
            </button>
          ))}
        </div>

        {/* Treinamentos Tab */}
        {mainTab === 'treinamentos' && (
          <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '24px' }}>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>Dias de treinamento</p>
                <div style={{ fontSize: '40px', fontWeight: 700, color: theme.textPrimary, marginBottom: '8px' }}>{currentData.days}</div>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>para este módulo</p>
              </div>

              <div style={{ background: isDark ? 'rgba(230, 178, 62, 0.1)' : 'rgba(230, 178, 62, 0.08)', border: `1px solid ${theme.yellow}`, borderRadius: '16px', padding: '24px' }}>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>Temas totais</p>
                <div style={{ fontSize: '40px', fontWeight: 700, color: theme.yellow, marginBottom: '8px' }}>{currentData.temas}</div>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>para aprender</p>
              </div>

              <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '24px' }}>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>Concluídos</p>
                <div style={{ fontSize: '40px', fontWeight: 700, color: theme.textPrimary, marginBottom: '8px' }}>0</div>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>temas finalizados</p>
              </div>

              <div style={{ background: isDark ? 'rgba(123, 92, 240, 0.1)' : 'rgba(230, 212, 255, 0.5)', border: `1px solid ${isDark ? '#5B43C0' : '#DDD4E8'}`, borderRadius: '16px', padding: '24px' }}>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '0 0 8px 0' }}>Progresso</p>
                <div style={{ fontSize: '40px', fontWeight: 700, color: isDark ? '#B7A8E6' : '#7C5CF0', marginBottom: '8px' }}>0%</div>
                <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>completado</p>
              </div>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: isDark ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.05)', padding: '8px', borderRadius: '12px', width: 'fit-content' }}>
              {['lcweb', 'lcerp', 'produtos'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSubTab(tab)}
                  style={{
                    border: 'none',
                    background: subTab === tab ? '#7C5CF0' : 'transparent',
                    color: subTab === tab ? '#fff' : theme.textSecondary,
                    fontSize: '14px',
                    fontWeight: '700',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {tab === 'lcweb' ? 'LC WEB' : tab === 'lcerp' ? 'LC ERP Desktop' : 'Serviços adicionais'}
                </button>
              ))}
            </div>

            {/* Day Cards */}
            <div>
              {currentData.items.map(item => (
                <div
                  key={item.day}
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '12px',
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    onClick={() => toggleDay(item.day)}
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      justifyContent: 'space-between',
                      background: expandedDays[item.day] ? theme.background : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: '#7C5CF0',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '16px'
                        }}
                      >
                        {item.day}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: theme.textPrimary }}>
                          {item.title}
                        </h3>
                        <p style={{ margin: 0, fontSize: '13px', color: theme.textSecondary }}>
                          {item.obj}
                        </p>
                      </div>
                    </div>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke={theme.textSecondary}
                      strokeWidth="2"
                      style={{
                        transform: expandedDays[item.day] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <polyline points="2 4 6 8 10 4" />
                    </svg>
                  </div>

                  {expandedDays[item.day] && (
                    <div style={{ borderTop: `1px solid ${theme.borderColor}`, padding: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {item.temas.map((tema, idx) => {
                          const key = `${subTab}-day${item.day}-tema${idx}`;
                          const isChecked = checkedItems[key] || false;
                          return (
                            <label
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 0',
                                cursor: 'pointer',
                                opacity: isChecked ? 0.6 : 1
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheck(key)}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  cursor: 'pointer',
                                  accentColor: '#7C5CF0'
                                }}
                              />
                              <code
                                style={{
                                  background: isDark ? 'rgba(124, 92, 240, 0.2)' : 'rgba(124, 92, 240, 0.1)',
                                  color: '#7C5CF0',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  fontFamily: 'monospace',
                                  textDecoration: isChecked ? 'line-through' : 'none'
                                }}
                              >
                                {tema}
                              </code>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lives Tab */}
        {mainTab === 'lives' && (
          <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: theme.textSecondary, margin: 0 }}>Em desenvolvimento...</p>
          </div>
        )}

        {/* Acompanhamento Tab */}
        {mainTab === 'acompanhamento' && (
          <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: theme.textSecondary, margin: 0 }}>Em desenvolvimento...</p>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
