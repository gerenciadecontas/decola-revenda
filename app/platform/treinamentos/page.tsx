'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';
import { useState, useEffect } from 'react';

const COLORS = {
  darkBg: '#0E1013',
  cardBg: '#16181D',
  borderColor: '#23262C',
  textPrimary: '#E8EAED',
  textSecondary: '#9AA1AA',
  textTertiary: '#6B7280',
  purple: '#8B5CF6',
  yellow: '#FFC93C',
  green: '#34D399',
};

const treinamentos = {
  lcweb: [
    { day: 1, title: 'Cadastro de Produtos', desc: 'Dominar o cadastro, edição e organização de produtos', temas: 7, screens: ['Cadastro/Produto', 'Cadastro/Categoria', 'Cadastro/Subcategoria', 'Cadastro/Unidade', 'Cadastro/Grade de Produtos', 'Cadastro/Tabela de Preços', 'Cadastro/Promoção'] },
    { day: 2, title: 'Vendas', desc: 'Operar PDV, balcão, pedidos, retaguarda de vendas e devoluções', temas: 5, screens: ['Venda/PDV', 'Venda/Balcão', 'Venda/Retaguarda', 'Venda/Devolução', 'Venda/Pedido de Venda'] },
    { day: 3, title: 'Cadastro de Pessoas', desc: 'Cadastrar e gerenciar clientes, funcionários, fornecedores e permissões', temas: 6, screens: ['Cadastro/Cliente', 'Cadastro/Funcionário', 'Cadastro/Fornecedor', 'Cadastro/Função do Usuário', 'Cadastro/Contabilista', 'Cadastro/Fabricante'] },
    { day: 4, title: 'Estoque', desc: 'Controlar entrada, saída, ajustes e transferências de estoque', temas: 7, screens: ['Estoque/Entrada', 'Estoque/Ajuste de Estoque', 'Estoque/Importação de XML', 'Estoque/Saída', 'Estoque/Transferência entre Empresas', 'Estoque/Transferência Local', 'Cadastro/Local de Estoque'] },
    { day: 5, title: 'Financeiro', desc: 'Gerenciar contas a pagar/receber, fluxo de caixa (DFC), DRE e crédito', temas: 6, screens: ['Financeiro/Contas a Receber', 'Financeiro/Contas a Pagar', 'Financeiro/DFC', 'Financeiro/Carta de Crédito', 'Financeiro/DRE', 'Cadastro/Caixa'] },
    { day: 6, title: 'Cadastros Fiscais e Tributários', desc: 'Configurar empresa, grupos de tributação, natureza de operação', temas: 6, screens: ['Cadastro/Empresa', 'Cadastro/Grupo de Tributação', 'Cadastro/Natureza da Operação', 'Cadastro/Forma de Pagamento', 'Cadastro/Plano de Contas', 'Cadastro/Centro de Custo'] },
    { day: 7, title: 'Fiscal – Emissão de Documentos', desc: 'Emitir e consultar NFe, NFCe e MDFe', temas: 3, screens: ['Fiscal/NFe', 'Fiscal/NFCe', 'Fiscal/MDFe'] },
    { day: 8, title: 'Relatórios e Dashboards', desc: 'Interpretar dashboards de vendas, caixa, financeiro, estoque', temas: 11, screens: ['Dashboard/Vendas', 'Relatório/Vendas', 'Relatório/Caixa', 'Relatório/Estoque', 'Relatório/Financeiro', 'Relatório/Favoritos', 'Relatório/Fiscal', 'Dashboard/Financeiro a Receber', 'Dashboard/Financeiro a Pagar', 'Dashboard/Estoque', 'Relatório/Cadastros'] },
    { day: 9, title: 'Configurações e Acesso', desc: 'Configurar o sistema, gerenciar acessos e autenticação', temas: 9, screens: ['Acesso/Login', 'Configuração/Geral', 'Acesso/Cadastro de Usuário', 'Configuração/Rápida', 'Supervisão/Autorização Remota', 'Configuração/Sistema', 'Acesso/Negado', 'Acesso/Recuperar Senha', 'Configuração/Importar Dados'] },
    { day: 10, title: 'Ferramentas Extras e Navegação Geral', desc: 'Apresentar etiquetas, IA, integrações, contabilidade', temas: 13, screens: ['Navegação/Início', 'Navegação/Raiz', 'Etiqueta/Impressão', 'Navegação/Novidades', 'Etiqueta/Criar', 'Navegação/Comprovante', 'Etiqueta/Listagem', 'Contabilidade/Arquivos XML', 'IA/Chat', 'IA/Insights', 'Integração/LCPay', 'E-commerce/Catálogo Digital', 'Marketplace/Amazon'] },
  ],
  lcerp: [
    { day: 1, title: 'Vendas', desc: 'Operar PDV, atendimento no balcão e retaguarda de vendas', temas: 3, screens: ['Venda/PDV', 'Venda/Atendimento Balcão', 'Venda/Retaguarda'] },
    { day: 2, title: 'Cadastros', desc: 'Cadastrar produtos, clientes, empresas, usuários', temas: 6, screens: ['Cadastro/Produto', 'Cadastro/Cliente', 'Cadastro/Empresa', 'Cadastro/Usuário', 'Cadastro/Forma de Pagamento', 'Cadastro/Contabilista'] },
    { day: 3, title: 'Estoque e Gestão', desc: 'Registrar entradas de estoque, acompanhar o dashboard', temas: 4, screens: ['Estoque/Entrada', 'Sistema/Dashboard', 'Sistema/Multiempresa', 'Configuração/PDV'] },
    { day: 4, title: 'Fiscal', desc: 'Emitir e transmitir documentos fiscais e obrigações acessórias', temas: 7, screens: ['Fiscal/NF-e', 'Fiscal/NFC-e', 'Fiscal/MD-e', 'Fiscal/MDF-e', 'Fiscal/CT-e', 'Fiscal/Sintegra', 'Fiscal/Sped'] },
  ],
  produtos: [
    { day: 1, title: 'Portfólio de Produtos LC', desc: 'Conhecer os produtos e integrações do ecossistema LC', temas: 8, screens: ['Produto/LC Pay', 'Produto/LC Força de Vendas', 'Produto/LC Gourmet', 'Produto/LC Balcão', 'Produto/LC Dashboard', 'Produto/LC Coletor de Dados', 'Produto/Smart TEF', 'Produto/Imendes'] },
  ],
};

export default function TreinamentosPage() {
  const [activeTab, setActiveTab] = useState<'lcweb' | 'lcerp' | 'produtos'>('lcweb');
  const [expandedDay, setExpandedDay] = useState(1);

  const tabData = treinamentos[activeTab];
  const totalTemas = tabData.reduce((sum, d) => sum + d.temas, 0);
  const totalDias = tabData.length;

  return (
    <PlatformLayout currentPage="treinamentos">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
            Treinamentos
          </h1>
          <p style={{ color: COLORS.textSecondary }}>Gerencie e acompanhe todos os treinamentos programados</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
          {(['lcweb', 'lcerp', 'produtos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setExpandedDay(1); }}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === tab ? COLORS.purple : 'transparent',
                color: activeTab === tab ? '#fff' : COLORS.textSecondary,
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'lcweb' ? 'LC WEB' : tab === 'lcerp' ? 'LC ERP Desktop' : 'Produtos'}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Total de Dias</p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{totalDias}</p>
          </div>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Total de Temas</p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{totalTemas}</p>
          </div>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Média de Temas/Dia</p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{Math.round(totalTemas / totalDias)}</p>
          </div>
        </div>

        {/* Day Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tabData.map((day) => (
            <div
              key={day.day}
              style={{
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.borderColor}`,
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? -1 : day.day)}
                style={{
                  width: '100%',
                  padding: '20px',
                  border: 'none',
                  background: 'transparent',
                  color: COLORS.textPrimary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: COLORS.purple,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {day.day}
                </div>
                <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{day.title}</div>
                  <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: 0 }}>{day.desc}</p>
                </div>
                <div style={{ fontSize: '12px', color: COLORS.textTertiary, textAlign: 'right', minWidth: '80px' }}>
                  {day.temas} temas
                </div>
                <div style={{ color: COLORS.textSecondary, transform: expandedDay === day.day ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  ▼
                </div>
              </button>

              {expandedDay === day.day && (
                <div style={{ borderTop: `1px solid ${COLORS.borderColor}`, padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '12px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, borderBottom: `1px solid ${COLORS.borderColor}` }}>
                          Tela/Tópico
                        </th>
                        <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, borderBottom: `1px solid ${COLORS.borderColor}` }}>
                          Acesso
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.screens.map((screen, idx) => (
                        <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.borderColor}` }}>
                          <td style={{ padding: '12px 0', color: COLORS.textPrimary }}>
                            <code style={{ background: `${COLORS.purple}22`, color: COLORS.purple, padding: '3px 8px', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace' }}>
                              {screen}
                            </code>
                          </td>
                          <td style={{ textAlign: 'right', padding: '12px 0', color: COLORS.textSecondary }}>
                            ✓
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PlatformLayout>
  );
}
