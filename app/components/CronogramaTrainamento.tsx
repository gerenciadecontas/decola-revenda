'use client';

import { useState, useEffect } from 'react';

type TrainingTab = 'lcweb' | 'lcerp' | 'produtos';
type UserRole = 'gestor' | 'agente-canal';

interface TrainingDay {
  day: number;
  title: string;
  description: string;
  temasCount: number;
  screens: string[];
}

const trainings: Record<TrainingTab, TrainingDay[]> = {
  lcweb: [
    { day: 1, title: 'Cadastro de Produtos', description: 'Dominar o cadastro, edição e organização de produtos', temasCount: 7, screens: ['Cadastro/Produto', 'Cadastro/Categoria', 'Cadastro/Subcategoria', 'Cadastro/Unidade', 'Cadastro/Grade de Produtos', 'Cadastro/Tabela de Preços', 'Cadastro/Promoção'] },
    { day: 2, title: 'Vendas', description: 'Operar PDV, balcão, pedidos, retaguarda de vendas e devoluções', temasCount: 5, screens: ['Venda/PDV', 'Venda/Balcão', 'Venda/Retaguarda', 'Venda/Devolução', 'Venda/Pedido de Venda'] },
    { day: 3, title: 'Cadastro de Pessoas', description: 'Cadastrar e gerenciar clientes, funcionários, fornecedores e permissões', temasCount: 6, screens: ['Cadastro/Cliente', 'Cadastro/Funcionário', 'Cadastro/Fornecedor', 'Cadastro/Função do Usuário', 'Cadastro/Contabilista', 'Cadastro/Fabricante'] },
    { day: 4, title: 'Estoque', description: 'Controlar entrada, saída, ajustes e transferências de estoque', temasCount: 7, screens: ['Estoque/Entrada', 'Estoque/Ajuste de Estoque', 'Estoque/Importação de XML', 'Estoque/Saída', 'Estoque/Transferência entre Empresas', 'Estoque/Transferência Local', 'Cadastro/Local de Estoque'] },
    { day: 5, title: 'Financeiro', description: 'Gerenciar contas a pagar/receber, fluxo de caixa (DFC), DRE e crédito', temasCount: 6, screens: ['Financeiro/Contas a Receber', 'Financeiro/Contas a Pagar', 'Financeiro/DFC', 'Financeiro/Carta de Crédito', 'Financeiro/DRE', 'Cadastro/Caixa'] },
    { day: 6, title: 'Cadastros Fiscais e Tributários', description: 'Configurar empresa, grupos de tributação, natureza de operação', temasCount: 6, screens: ['Cadastro/Empresa', 'Cadastro/Grupo de Tributação', 'Cadastro/Natureza da Operação', 'Cadastro/Forma de Pagamento', 'Cadastro/Plano de Contas', 'Cadastro/Centro de Custo'] },
    { day: 7, title: 'Fiscal – Emissão de Documentos', description: 'Emitir e consultar NFe, NFCe e MDFe', temasCount: 3, screens: ['Fiscal/NFe', 'Fiscal/NFCe', 'Fiscal/MDFe'] },
    { day: 8, title: 'Relatórios e Dashboards', description: 'Interpretar dashboards de vendas, caixa, financeiro, estoque', temasCount: 11, screens: ['Dashboard/Vendas', 'Relatório/Vendas', 'Relatório/Caixa', 'Relatório/Estoque', 'Relatório/Financeiro', 'Relatório/Favoritos', 'Relatório/Fiscal', 'Dashboard/Financeiro a Receber', 'Dashboard/Financeiro a Pagar', 'Dashboard/Estoque', 'Relatório/Cadastros'] },
    { day: 9, title: 'Configurações e Acesso', description: 'Configurar o sistema, gerenciar acessos e autenticação', temasCount: 9, screens: ['Acesso/Login', 'Configuração/Geral', 'Acesso/Cadastro de Usuário', 'Configuração/Rápida', 'Supervisão/Autorização Remota', 'Configuração/Sistema', 'Acesso/Negado', 'Acesso/Recuperar Senha', 'Configuração/Importar Dados'] },
    { day: 10, title: 'Ferramentas Extras e Navegação Geral', description: 'Apresentar etiquetas, IA, integrações, contabilidade', temasCount: 13, screens: ['Navegação/Início', 'Navegação/Raiz', 'Etiqueta/Impressão', 'Navegação/Novidades', 'Etiqueta/Criar', 'Navegação/Comprovante', 'Etiqueta/Listagem', 'Contabilidade/Arquivos XML', 'IA/Chat', 'IA/Insights', 'Integração/LCPay', 'E-commerce/Catálogo Digital', 'Marketplace/Amazon'] },
  ],
  lcerp: [
    { day: 1, title: 'Vendas', description: 'Operar PDV, atendimento no balcão e retaguarda de vendas', temasCount: 3, screens: ['Venda/PDV', 'Venda/Atendimento Balcão', 'Venda/Retaguarda'] },
    { day: 2, title: 'Cadastros', description: 'Cadastrar produtos, clientes, empresas, usuários', temasCount: 6, screens: ['Cadastro/Produto', 'Cadastro/Cliente', 'Cadastro/Empresa', 'Cadastro/Usuário', 'Cadastro/Forma de Pagamento', 'Cadastro/Contabilista'] },
    { day: 3, title: 'Estoque e Gestão', description: 'Registrar entradas de estoque, acompanhar o dashboard', temasCount: 4, screens: ['Estoque/Entrada', 'Sistema/Dashboard', 'Sistema/Multiempresa', 'Configuração/PDV'] },
    { day: 4, title: 'Fiscal', description: 'Emitir e transmitir documentos fiscais e obrigações acessórias', temasCount: 7, screens: ['Fiscal/NF-e', 'Fiscal/NFC-e', 'Fiscal/MD-e', 'Fiscal/MDF-e', 'Fiscal/CT-e', 'Fiscal/Sintegra', 'Fiscal/Sped'] },
  ],
  produtos: [
    { day: 1, title: 'Portfólio de Produtos LC', description: 'Conhecer os produtos e integrações do ecossistema LC', temasCount: 8, screens: ['Produto/LC Pay', 'Produto/LC Força de Vendas', 'Produto/LC Gourmet', 'Produto/LC Balcão', 'Produto/LC Dashboard', 'Produto/LC Coletor de Dados', 'Produto/Smart TEF', 'Produto/Imendes'] },
  ],
};

export function CronogramaTrainamento() {
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [selectedTab, setSelectedTab] = useState<TrainingTab>('lcweb');
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  // Carrega o role do localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('trainingRole') as UserRole | null;
    setUserRoleState(savedRole || 'gestor');
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('trainingRole', role);
  };

  useEffect(() => {
    const saved = localStorage.getItem(`training-progress-${selectedTab}`);
    if (saved) setProgress(JSON.parse(saved));
  }, [selectedTab]);

  const saveProgress = (key: string, value: boolean) => {
    const newProgress = { ...progress, [key]: value };
    setProgress(newProgress);
    localStorage.setItem(`training-progress-${selectedTab}`, JSON.stringify(newProgress));
  };

  if (userRole === null) {
    return null;
  }

  const days = trainings[selectedTab];
  const completedScreens = Object.values(progress).filter(Boolean).length;
  const totalScreens = days.reduce((sum, d) => sum + d.temasCount, 0);
  const progressPct = Math.round((completedScreens / totalScreens) * 100);

  const roleDescriptions = {
    'gestor': 'Gerencie e acompanhe o progresso dos treinamentos das revendas',
    'agente-canal': 'Responsável por acompanhar o progresso dos treinamentos de todas as revendas'
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Role Toggle Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setUserRole('gestor')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            userRole === 'gestor'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          👤 Gestor
        </button>
        <button
          onClick={() => setUserRole('agente-canal')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            userRole === 'agente-canal'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🚀 Agente de Canal
        </button>
      </div>

      <p className="text-gray-600 mb-6">{roleDescriptions[userRole]}</p>

      <div className="max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['lcweb', 'lcerp', 'produtos'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              selectedTab === tab
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'lcweb' ? 'LC WEB' : tab === 'lcerp' ? 'LC ERP Desktop' : 'Produtos'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total de Dias</p>
          <p className="text-3xl font-bold text-gray-900">{days.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total de Temas</p>
          <p className="text-3xl font-bold text-gray-900">{totalScreens}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Temas Concluídos</p>
          <p className="text-3xl font-bold text-gray-900">{completedScreens}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Progresso Geral</p>
          <p className="text-3xl font-bold text-purple-600">{progressPct}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="font-medium text-gray-900">Progresso do Treinamento</p>
          <p className="text-sm text-gray-600">{completedScreens}/{totalScreens} concluídos</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Training Days */}
      <div className="space-y-4">
        {days.map((day) => (
          <details
            key={day.day}
            open={expandedDay === day.day}
            onToggle={() => setExpandedDay(expandedDay === day.day ? -1 : day.day)}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <summary className="cursor-pointer p-6 hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold">
                  {day.day}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{day.title}</h3>
                  <p className="text-sm text-gray-600">{day.description}</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">{day.temasCount} temas</span>
            </summary>

            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-700 pb-3">Tela</th>
                    <th className="text-right text-xs font-semibold text-gray-700 pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {day.screens.map((screen, idx) => {
                    const key = `${selectedTab}-day${day.day}-screen${idx}`;
                    const isComplete = progress[key] || false;
                    return (
                      <tr key={key} className={isComplete ? 'bg-gray-100' : ''}>
                        <td className="py-3 text-sm">
                          <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                            {screen}
                          </code>
                        </td>
                        <td className="py-3 text-right">
                          <input
                            type="checkbox"
                            checked={isComplete}
                            onChange={(e) => saveProgress(key, e.target.checked)}
                            className="w-5 h-5 cursor-pointer accent-purple-600"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
