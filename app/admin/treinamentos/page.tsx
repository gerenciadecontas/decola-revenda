'use client';

import { GestorLayout } from '@/app/components/GestorLayout';
import { useState, useEffect } from 'react';

const getColors = () => ({
  darkBg: 'var(--bg-a)',
  cardBg: 'var(--panel)',
  borderColor: 'var(--line)',
  textPrimary: 'var(--ink)',
  textSecondary: 'var(--ink-2)',
  textTertiary: 'var(--ink-3)',
  purple: 'var(--purple)',
  yellow: 'var(--yellow-d)',
  green: '#4E8E5B',
  red: 'var(--red)',
});

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
  servicos: [
    { day: 1, title: 'Portfólio de Produtos LC', desc: 'Conhecer os produtos e integrações do ecossistema LC', temas: 8, screens: ['Produto/LC Pay', 'Produto/LC Força de Vendas', 'Produto/LC Gourmet', 'Produto/LC Balcão', 'Produto/LC Dashboard', 'Produto/LC Coletor de Dados', 'Produto/Smart TEF', 'Produto/Imendes'] },
  ],
};

const livesSemanaisDefault = [
  { id: 'live-1', dia: 'Segunda', horario: '14:00', tema: 'Dicas de Vendas e Estratégias de Faturamento', descricao: 'Aprenda técnicas avançadas para aumentar suas vendas e melhorar o faturamento mensal.', instrutor: 'Ana Silva', cor: '#8B5CF6' },
  { id: 'live-2', dia: 'Quarta', horario: '15:30', tema: 'Gestão Eficiente de Estoque', descricao: 'Como organizar e controlar seu estoque para evitar perdas e otimizar recursos.', instrutor: 'Carlos Santos', cor: '#F5A623' },
  { id: 'live-3', dia: 'Sexta', horario: '10:00', tema: 'Análise de Dados e Relatórios', descricao: 'Entenda como usar dados para tomar decisões melhores no seu negócio.', instrutor: 'Marina Costa', cor: '#52C77C' },
];

export default function TreinamentosPage() {
  const [mainTab, setMainTab] = useState<'diarios' | 'lives' | 'acompanhamento'>('diarios');
  const [activeTab, setActiveTab] = useState<'lcweb' | 'lcerp' | 'servicos'>('lcweb');
  const [expandedDay, setExpandedDay] = useState(1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [checkedLives, setCheckedLives] = useState<Record<string, boolean>>({});
  const [lives, setLives] = useState<typeof livesSemanaisDefault>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedLiveId, setExpandedLiveId] = useState<string | null>(null);
  const [participacoesTreinamentos, setParticipacoesTreinamentos] = useState<Record<string, string[]>>({});
  const [participacoesLives, setParticipacoesLives] = useState<Record<string, string[]>>({});
  const [novaRevendaTreinamento, setNovaRevendaTreinamento] = useState('');
  const [novaRevendaLive, setNovaRevendaLive] = useState('');
  const [formData, setFormData] = useState({
    dia: '',
    horario: '',
    tema: '',
    descricao: '',
    instrutor: '',
    cor: '#8B5CF6',
  });

  useEffect(() => {
    const saved = localStorage.getItem(`treinamentos-admin-${activeTab}`);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    } else {
      setCheckedItems({});
    }
  }, [activeTab]);

  useEffect(() => {
    const saved = localStorage.getItem('cronograma-lives');
    if (saved) {
      setLives(JSON.parse(saved));
    } else {
      setLives(livesSemanaisDefault);
      localStorage.setItem('cronograma-lives', JSON.stringify(livesSemanaisDefault));
    }

    const savedChecked = localStorage.getItem('lives-assistidas');
    if (savedChecked) {
      setCheckedLives(JSON.parse(savedChecked));
    }

    const savedParticipacoesTreinamentos = localStorage.getItem('participacoes-treinamentos');
    if (savedParticipacoesTreinamentos) {
      setParticipacoesTreinamentos(JSON.parse(savedParticipacoesTreinamentos));
    }

    const savedParticipacoesLives = localStorage.getItem('participacoes-lives');
    if (savedParticipacoesLives) {
      setParticipacoesLives(JSON.parse(savedParticipacoesLives));
    }
  }, []);

  const handleCheck = (key: string) => {
    const updated = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(updated);
    localStorage.setItem(`treinamentos-admin-${activeTab}`, JSON.stringify(updated));
  };

  const handleCheckLive = (id: string) => {
    const updated = { ...checkedLives, [id]: !checkedLives[id] };
    setCheckedLives(updated);
    localStorage.setItem('lives-assistidas', JSON.stringify(updated));
  };

  const handleAddRevendaTreinamento = (dayKey: string) => {
    if (!novaRevendaTreinamento.trim()) return;
    const revendaTrimmed = novaRevendaTreinamento.trim();
    const updated = { ...participacoesTreinamentos };
    if (!updated[dayKey]) {
      updated[dayKey] = [];
    }
    if (!updated[dayKey].includes(revendaTrimmed)) {
      updated[dayKey].push(revendaTrimmed);
      setParticipacoesTreinamentos(updated);
      localStorage.setItem('participacoes-treinamentos', JSON.stringify(updated));
    }
    setNovaRevendaTreinamento('');
  };

  const handleRemoveRevendaTreinamento = (dayKey: string, revenda: string) => {
    const updated = { ...participacoesTreinamentos };
    updated[dayKey] = updated[dayKey].filter(r => r !== revenda);
    if (updated[dayKey].length === 0) {
      delete updated[dayKey];
    }
    setParticipacoesTreinamentos(updated);
    localStorage.setItem('participacoes-treinamentos', JSON.stringify(updated));
  };

  const handleAddRevendaLive = (liveId: string) => {
    if (!novaRevendaLive.trim()) return;
    const revendaTrimmed = novaRevendaLive.trim();
    const updated = { ...participacoesLives };
    if (!updated[liveId]) {
      updated[liveId] = [];
    }
    if (!updated[liveId].includes(revendaTrimmed)) {
      updated[liveId].push(revendaTrimmed);
      setParticipacoesLives(updated);
      localStorage.setItem('participacoes-lives', JSON.stringify(updated));
    }
    setNovaRevendaLive('');
  };

  const handleRemoveRevendaLive = (liveId: string, revenda: string) => {
    const updated = { ...participacoesLives };
    updated[liveId] = updated[liveId].filter(r => r !== revenda);
    if (updated[liveId].length === 0) {
      delete updated[liveId];
    }
    setParticipacoesLives(updated);
    localStorage.setItem('participacoes-lives', JSON.stringify(updated));
  };

  const handleSaveLive = () => {
    if (!formData.dia || !formData.horario || !formData.tema || !formData.instrutor) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    let updated;
    if (editingId) {
      updated = lives.map(l => l.id === editingId ? { ...formData, id: editingId, cor: formData.cor } : l);
    } else {
      updated = [...lives, { ...formData, id: `live-${Date.now()}`, cor: formData.cor }];
    }

    setLives(updated);
    localStorage.setItem('cronograma-lives', JSON.stringify(updated));
    setFormData({ dia: '', horario: '', tema: '', descricao: '', instrutor: '', cor: '#8B5CF6' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleDeleteLive = (id: string) => {
    const updated = lives.filter(l => l.id !== id);
    setLives(updated);
    localStorage.setItem('cronograma-lives', JSON.stringify(updated));
  };

  const handleEditLive = (live: typeof lives[0]) => {
    setFormData({ dia: live.dia, horario: live.horario, tema: live.tema, descricao: live.descricao, instrutor: live.instrutor, cor: live.cor });
    setEditingId(live.id);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setFormData({ dia: '', horario: '', tema: '', descricao: '', instrutor: '', cor: '#8B5CF6' });
    setShowForm(false);
    setEditingId(null);
  };

  const getAllRevendas = () => {
    const revendasSet = new Set<string>();

    Object.values(participacoesTreinamentos).forEach(revendas => {
      revendas.forEach(r => revendasSet.add(r));
    });

    Object.values(participacoesLives).forEach(revendas => {
      revendas.forEach(r => revendasSet.add(r));
    });

    return Array.from(revendasSet).sort();
  };

  const getRevendaTreinamentos = (revenda: string) => {
    return Object.entries(participacoesTreinamentos)
      .filter(([_, revendas]) => revendas.includes(revenda))
      .map(([dayKey]) => dayKey);
  };

  const getRevendaLives = (revenda: string) => {
    return Object.entries(participacoesLives)
      .filter(([_, revendas]) => revendas.includes(revenda))
      .map(([liveId]) => liveId);
  };

  const COLORS = getColors();
  const tabData = treinamentos[activeTab];
  const totalTemas = tabData.reduce((sum, d) => sum + d.temas, 0);
  const totalDias = tabData.length;
  const completedTemas = Object.values(checkedItems).filter(Boolean).length;
  const completedLives = Object.values(checkedLives).filter(Boolean).length;
  const allRevendas = getAllRevendas();

  return (
    <GestorLayout currentPage="treinamentos">
      <div style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: COLORS.darkBg, padding: '32px 0' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
            Treinamentos
          </h1>
          <p style={{ color: COLORS.textSecondary }}>Gerencie sua jornada de capacitação e cronograma de lives</p>
        </div>

        {/* Main Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', borderBottom: `2px solid ${COLORS.borderColor}`, paddingBottom: '0', overflowX: 'auto' }}>
          <button
            onClick={() => setMainTab('diarios')}
            style={{
              padding: '16px 24px',
              borderRadius: '12px 12px 0 0',
              border: 'none',
              background: mainTab === 'diarios' ? COLORS.purple : 'transparent',
              color: mainTab === 'diarios' ? '#fff' : COLORS.textSecondary,
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            📚 Treinamentos
          </button>
          <button
            onClick={() => setMainTab('lives')}
            style={{
              padding: '16px 24px',
              borderRadius: '12px 12px 0 0',
              border: 'none',
              background: mainTab === 'lives' ? COLORS.purple : 'transparent',
              color: mainTab === 'lives' ? '#fff' : COLORS.textSecondary,
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            🔴 Cronograma de Lives
          </button>
          <button
            onClick={() => setMainTab('acompanhamento')}
            style={{
              padding: '16px 24px',
              borderRadius: '12px 12px 0 0',
              border: 'none',
              background: mainTab === 'acompanhamento' ? COLORS.purple : 'transparent',
              color: mainTab === 'acompanhamento' ? '#fff' : COLORS.textSecondary,
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            📊 Acompanhamento de Revendas
          </button>
        </div>

        {/* TAB: TREINAMENTOS DIÁRIOS */}
        {mainTab === 'diarios' && (
          <div>
            {/* Progress Card */}
            <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '18px', padding: '20px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '48px' }}>📈</div>
              <div>
                <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: 0 }}>Progresso geral</p>
                <p style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>
                  {totalTemas > 0 ? Math.round((completedTemas / totalTemas) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Sub Tabs - Produtos */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
              {(['lcweb', 'lcerp', 'servicos'] as const).map((tab) => (
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
                  {tab === 'lcweb' ? 'LC WEB' : tab === 'lcerp' ? 'LC ERP Desktop' : 'Serviços Adicionais'}
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
                <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Temas Concluídos</p>
                <p style={{ fontSize: '32px', fontWeight: 700, color: COLORS.green, margin: 0 }}>{completedTemas}</p>
              </div>
            </div>

            {/* Day Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tabData.map((day) => {
                const dayKey = `${activeTab}-day${day.day}`;
                const revendasParticipantes = participacoesTreinamentos[dayKey] || [];

                return (
                  <div key={day.day} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', overflow: 'hidden' }}>
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
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: COLORS.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', color: '#fff', flexShrink: 0 }}>
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
                      <div style={{ borderTop: `1px solid ${COLORS.borderColor}`, padding: '20px', background: 'rgba(124, 92, 240, 0.05)' }}>
                        {/* Temas Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginBottom: '24px' }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '12px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, borderBottom: `1px solid ${COLORS.borderColor}` }}>
                                Tela/Tópico
                              </th>
                              <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, borderBottom: `1px solid ${COLORS.borderColor}` }}>
                                Realizado
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.screens.map((screen, idx) => {
                              const key = `${activeTab}-day${day.day}-${idx}`;
                              const isChecked = checkedItems[key] || false;
                              return (
                                <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.borderColor}`, background: isChecked ? 'rgba(52, 211, 153, 0.05)' : 'transparent' }}>
                                  <td style={{ padding: '12px 0', color: COLORS.textPrimary, textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.6 : 1 }}>
                                    <code style={{ background: `${COLORS.purple}22`, color: COLORS.purple, padding: '3px 8px', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace' }}>
                                      {screen}
                                    </code>
                                  </td>
                                  <td style={{ textAlign: 'right', padding: '12px 0' }}>
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleCheck(key)}
                                      style={{
                                        width: '18px',
                                        height: '18px',
                                        cursor: 'pointer',
                                        accentColor: COLORS.green,
                                      }}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        {/* Revendas Participantes Section */}
                        <div style={{ paddingTop: '20px', borderTop: `1px solid ${COLORS.borderColor}` }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '12px' }}>
                            🏢 Revendas Participantes
                          </h4>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <input
                              type="text"
                              value={novaRevendaTreinamento}
                              onChange={(e) => setNovaRevendaTreinamento(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddRevendaTreinamento(dayKey);
                                }
                              }}
                              placeholder="Adicionar revenda..."
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                border: `1px solid ${COLORS.borderColor}`,
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: COLORS.textPrimary,
                                background: '#fff',
                              }}
                            />
                            <button
                              onClick={() => handleAddRevendaTreinamento(dayKey)}
                              style={{
                                padding: '8px 16px',
                                background: COLORS.green,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              + Adicionar
                            </button>
                          </div>

                          {revendasParticipantes.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {revendasParticipantes.map((revenda, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: `${COLORS.purple}22`,
                                    border: `1px solid ${COLORS.purple}`,
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                  }}
                                >
                                  <span style={{ fontSize: '13px', color: COLORS.textPrimary }}>
                                    {revenda}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveRevendaTreinamento(dayKey, revenda)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: COLORS.red,
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      padding: '0',
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ fontSize: '13px', color: COLORS.textTertiary, margin: 0 }}>Nenhuma revenda adicionada ainda</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: CRONOGRAMA DE LIVES */}
        {mainTab === 'lives' && (
          <div>
            {/* Button Adicionar Live */}
            <div style={{ marginBottom: '30px' }}>
              <button
                onClick={() => setShowForm(!showForm)}
                style={{
                  padding: '12px 24px',
                  background: COLORS.purple,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#6C4CD5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.purple)}
              >
                {showForm ? '✕ Cancelar' : '+ Adicionar Nova Live'}
              </button>
            </div>

            {/* Form Adicionar/Editar Live */}
            {showForm && (
              <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '24px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '20px' }}>
                  {editingId ? '✏️ Editar Live' : '🎬 Nova Live'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textPrimary, display: 'block', marginBottom: '6px' }}>Dia da Semana *</label>
                    <select
                      value={formData.dia}
                      onChange={(e) => setFormData({ ...formData, dia: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${COLORS.borderColor}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: COLORS.textPrimary,
                        background: '#fff',
                      }}
                    >
                      <option value="">Selecione...</option>
                      <option value="Segunda">Segunda</option>
                      <option value="Terça">Terça</option>
                      <option value="Quarta">Quarta</option>
                      <option value="Quinta">Quinta</option>
                      <option value="Sexta">Sexta</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textPrimary, display: 'block', marginBottom: '6px' }}>Horário *</label>
                    <input
                      type="time"
                      value={formData.horario}
                      onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${COLORS.borderColor}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: COLORS.textPrimary,
                        background: '#fff',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textPrimary, display: 'block', marginBottom: '6px' }}>Cor</label>
                    <input
                      type="color"
                      value={formData.cor}
                      onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                      style={{
                        width: '100%',
                        height: '40px',
                        border: `1px solid ${COLORS.borderColor}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textPrimary, display: 'block', marginBottom: '6px' }}>Tema *</label>
                  <input
                    type="text"
                    value={formData.tema}
                    onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                    placeholder="Ex: Dicas de Vendas"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${COLORS.borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: COLORS.textPrimary,
                      background: '#fff',
                    }}
                  />
                </div>
                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textPrimary, display: 'block', marginBottom: '6px' }}>Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição da live..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${COLORS.borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: COLORS.textPrimary,
                      background: '#fff',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textPrimary, display: 'block', marginBottom: '6px' }}>Instrutor *</label>
                  <input
                    type="text"
                    value={formData.instrutor}
                    onChange={(e) => setFormData({ ...formData, instrutor: e.target.value })}
                    placeholder="Nome do instrutor"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${COLORS.borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: COLORS.textPrimary,
                      background: '#fff',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    onClick={handleSaveLive}
                    style={{
                      padding: '10px 20px',
                      background: COLORS.green,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {editingId ? '✓ Atualizar' : '+ Criar'}
                  </button>
                  <button
                    onClick={handleCancelForm}
                    style={{
                      padding: '10px 20px',
                      background: COLORS.textTertiary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Stats Lives */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
              <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '20px' }}>
                <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Total de Lives</p>
                <p style={{ fontSize: '32px', fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{lives.length}</p>
              </div>
              <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.borderColor}`, borderRadius: '16px', padding: '20px' }}>
                <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: '0 0 8px 0' }}>Lives Assistidas</p>
                <p style={{ fontSize: '32px', fontWeight: 700, color: COLORS.green, margin: 0 }}>{completedLives}</p>
              </div>
            </div>

            {/* Lives List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {lives.map((live) => {
                const isChecked = checkedLives[live.id] || false;
                const revendasParticipantes = participacoesLives[live.id] || [];
                const isExpanded = expandedLiveId === live.id;

                return (
                  <div
                    key={live.id}
                    style={{
                      background: COLORS.cardBg,
                      border: `2px solid ${live.cor}`,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      opacity: isChecked ? 0.7 : 1,
                    }}
                  >
                    <div
                      onClick={() => setExpandedLiveId(isExpanded ? null : live.id)}
                      style={{
                        padding: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        gap: '16px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: live.cor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                          {live.dia} • {live.horario}
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary, margin: '4px 0', textDecoration: isChecked ? 'line-through' : 'none' }}>
                          {live.tema}
                        </h3>
                        {live.descricao && <p style={{ fontSize: '13px', color: COLORS.textSecondary, margin: '8px 0 0 0' }}>{live.descricao}</p>}
                        <div style={{ fontSize: '12px', color: COLORS.textTertiary, marginTop: '12px' }}>
                          Instrutor: <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{live.instrutor}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckLive(live.id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            accentColor: live.cor,
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLive(live);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: COLORS.purple,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLive(live.id);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: COLORS.red,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Deletar
                        </button>
                        <div style={{ color: COLORS.textSecondary, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginTop: '4px' }}>
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Expanded - Revendas Participantes */}
                    {isExpanded && (
                      <div style={{ borderTop: `1px solid ${COLORS.borderColor}`, padding: '20px', background: 'rgba(124, 92, 240, 0.05)' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '12px' }}>
                          🏢 Revendas Participantes
                        </h4>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                          <input
                            type="text"
                            value={novaRevendaLive}
                            onChange={(e) => setNovaRevendaLive(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddRevendaLive(live.id);
                              }
                            }}
                            placeholder="Adicionar revenda..."
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              border: `1px solid ${COLORS.borderColor}`,
                              borderRadius: '6px',
                              fontSize: '13px',
                              color: COLORS.textPrimary,
                              background: '#fff',
                            }}
                          />
                          <button
                            onClick={() => handleAddRevendaLive(live.id)}
                            style={{
                              padding: '8px 16px',
                              background: COLORS.green,
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            + Adicionar
                          </button>
                        </div>

                        {revendasParticipantes.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {revendasParticipantes.map((revenda, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  background: `${COLORS.purple}22`,
                                  border: `1px solid ${COLORS.purple}`,
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                }}
                              >
                                <span style={{ fontSize: '13px', color: COLORS.textPrimary }}>
                                  {revenda}
                                </span>
                                <button
                                  onClick={() => handleRemoveRevendaLive(live.id, revenda)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: COLORS.red,
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '13px', color: COLORS.textTertiary, margin: 0 }}>Nenhuma revenda adicionada ainda</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {lives.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: COLORS.cardBg, borderRadius: '16px', border: `1px solid ${COLORS.borderColor}` }}>
                <p style={{ fontSize: '16px', color: COLORS.textSecondary }}>📭 Nenhuma live cadastrada ainda</p>
                <p style={{ fontSize: '14px', color: COLORS.textTertiary, marginTop: '8px' }}>Clique no botão acima para adicionar uma nova live!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: ACOMPANHAMENTO DE REVENDAS */}
        {mainTab === 'acompanhamento' && (
          <div>
            {/* Revendas List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {allRevendas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: COLORS.cardBg, borderRadius: '16px', border: `1px solid ${COLORS.borderColor}` }}>
                  <p style={{ fontSize: '16px', color: COLORS.textSecondary }}>📭 Nenhuma revenda cadastrada</p>
                  <p style={{ fontSize: '14px', color: COLORS.textTertiary, marginTop: '8px' }}>Marque participações de revendas nas abas de Treinamentos ou Cronograma de Lives para vê-las aqui</p>
                </div>
              ) : (
                allRevendas.map((revenda) => {
                  const treinamentos = getRevendaTreinamentos(revenda);
                  const liveIds = getRevendaLives(revenda);

                  return (
                    <div
                      key={revenda}
                      style={{
                        background: COLORS.cardBg,
                        border: `1px solid ${COLORS.borderColor}`,
                        borderRadius: '16px',
                        padding: '20px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '32px' }}>🏢</div>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 600, color: COLORS.textPrimary, margin: '0 0 4px 0' }}>
                            {revenda}
                          </h3>
                          <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: 0 }}>
                            {treinamentos.length} treinamentos • {liveIds.length} lives
                          </p>
                        </div>
                      </div>

                      {/* Treinamentos */}
                      {treinamentos.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '8px' }}>
                            📚 Treinamentos
                          </h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {treinamentos.map((trainingKey, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '12px',
                                  background: `${COLORS.purple}22`,
                                  color: COLORS.purple,
                                  padding: '4px 10px',
                                  borderRadius: '4px',
                                  border: `1px solid ${COLORS.purple}`,
                                }}
                              >
                                {trainingKey.replace('lcweb-day', 'Dia ').replace('lcerp-day', 'Dia ').replace('servicos-day', 'Dia ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lives */}
                      {liveIds.length > 0 && (
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '8px' }}>
                            🔴 Lives
                          </h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {liveIds.map((liveId, idx) => {
                              const live = lives.find(l => l.id === liveId);
                              return (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: '12px',
                                    background: `${live?.cor}22`,
                                    color: live?.cor,
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    border: `1px solid ${live?.cor}`,
                                  }}
                                >
                                  {live?.dia} - {live?.tema}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </GestorLayout>
  );
}
