export const temaKey = (modulo: string, day: number, idx: number) => `${modulo}-day${day}-tema${idx}`;

export const TREINAMENTOS_DATA = {
  lcweb: {
    label: 'LC WEB',
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
    label: 'Serviços adicionais',
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

export type ModuloId = keyof typeof TREINAMENTOS_DATA;

export interface TreinamentoItem {
  day: number;
  title: string;
  obj: string;
  temas: string[];
  custom?: boolean;
  id?: string;
}

export interface CustomRow {
  id?: string;
  modulo: ModuloId;
  dia: number;
  title: string;
  obj: string | null;
  temas: string[];
}

export interface ProgressRow {
  tema_key: string;
}

export const CUSTOM_TABLE = 'jornada_treinamentos_custom';
export const PROGRESS_TABLE = 'jornada_progresso';

export const MODULO_IDS = Object.keys(TREINAMENTOS_DATA) as ModuloId[];

export const getModulos = (custom: CustomRow[]) =>
  MODULO_IDS.map(id => ({
    id,
    label: TREINAMENTOS_DATA[id].label,
    items: [
      ...(TREINAMENTOS_DATA[id].items as TreinamentoItem[]),
      ...custom
        .filter(c => c.modulo === id)
        .sort((a, b) => a.dia - b.dia)
        .map(c => ({ id: c.id, day: c.dia, title: c.title, obj: c.obj || '', temas: c.temas || [], custom: true })),
    ],
  }));

export const checkedFrom = (rows: ProgressRow[]) => Object.fromEntries(rows.map(r => [r.tema_key, true])) as Record<string, boolean>;
