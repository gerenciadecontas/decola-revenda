-- Seed script completo para popular dados iniciais
-- Execute este script na aba SQL do Supabase após as migrations

-- 1. Inserir Trilhas
INSERT INTO trilhas (nome, descricao) VALUES
('LC WEB', 'Sistema LC WEB - versão web do ERP com 10 dias de treinamento'),
('LC ERP Desktop', 'Sistema LC ERP Desktop - versão desktop com 4 dias de treinamento'),
('Produtos', 'Portfolio de produtos e integrações LC com 1 dia de treinamento');

-- 2. Dias e Temas para LC WEB (10 dias, 73 temas total)

-- Dia 1: Cadastro de Produtos
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 1, 'Cadastro de Produtos', 'Dominar o cadastro, edição e organização de produtos – a tela mais acessada do sistema.');

INSERT INTO temas (dia_id, nome_tela, acessos) VALUES
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Produto', 100436),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Categoria', 100436),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Subcategoria', 100436),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Unidade', 100436),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Grade de Produtos', 100436),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Tabela de Preços', 100436),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Promoção', 100436);

-- Dia 2: Vendas
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 2, 'Vendas', 'Operar PDV, balcão, pedidos, retaguarda de vendas e devoluções.');

INSERT INTO temas (dia_id, nome_tela, acessos) VALUES
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Venda/PDV', 72614),
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Venda/Balcão', 72614),
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Venda/Retaguarda', 72614),
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Venda/Devolução', 72614),
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Venda/Pedido de Venda', 72614);

-- Dia 3: Cadastro de Pessoas
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 3, 'Cadastro de Pessoas', 'Cadastrar e gerenciar clientes, funcionários, fornecedores e permissões de usuário.');

INSERT INTO temas (dia_id, nome_tela, acessos) VALUES
((SELECT id FROM dias WHERE numero = 3 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Cliente', 14395),
((SELECT id FROM dias WHERE numero = 3 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Funcionário', 14395),
((SELECT id FROM dias WHERE numero = 3 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Fornecedor', 14395),
((SELECT id FROM dias WHERE numero = 3 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Função do Usuário', 14395),
((SELECT id FROM dias WHERE numero = 3 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Contabilista', 14395),
((SELECT id FROM dias WHERE numero = 3 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Fabricante', 14395);

-- Dia 4: Estoque
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 4, 'Estoque', 'Controlar entrada, saída, ajustes e transferências de estoque, incluindo importação de XML.');

INSERT INTO temas (dia_id, nome_tela, acessos) VALUES
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Estoque/Entrada', 22838),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Estoque/Ajuste de Estoque', 22838),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Estoque/Importação de XML', 22838),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Estoque/Saída', 22838),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Estoque/Transferência entre Empresas', 22838),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Estoque/Transferência Local', 22838),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Local de Estoque', 22838);

-- Dia 5: Financeiro
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 5, 'Financeiro', 'Gerenciar contas a pagar/receber, fluxo de caixa (DFC), DRE e crédito.');

INSERT INTO temas (dia_id, nome_tela, acessos) VALUES
((SELECT id FROM dias WHERE numero = 5 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Financeiro/Contas a Receber', 14661),
((SELECT id FROM dias WHERE numero = 5 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Financeiro/Contas a Pagar', 14661),
((SELECT id FROM dias WHERE numero = 5 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Financeiro/DFC', 14661),
((SELECT id FROM dias WHERE numero = 5 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Financeiro/Carta de Crédito', 14661),
((SELECT id FROM dias WHERE numero = 5 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Financeiro/DRE', 14661),
((SELECT id FROM dias WHERE numero = 5 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Caixa', 14661);

-- Dia 6: Cadastros Fiscais e Tributários
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 6, 'Cadastros Fiscais e Tributários', 'Configurar empresa, grupos de tributação, natureza de operação e cadastros fiscais de apoio.');

INSERT INTO temas (dia_id, nome_tela, acessos) VALUES
((SELECT id FROM dias WHERE numero = 6 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Empresa', 7225),
((SELECT id FROM dias WHERE numero = 6 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Grupo de Tributação', 7225),
((SELECT id FROM dias WHERE numero = 6 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Natureza da Operação', 7225),
((SELECT id FROM dias WHERE numero = 6 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Forma de Pagamento', 7225),
((SELECT id FROM dias WHERE numero = 6 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Plano de Contas', 7225),
((SELECT id FROM dias WHERE numero = 6 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Centro de Custo', 7225);

-- Dia 7: Fiscal – Emissão de Documentos
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 7, 'Fiscal – Emissão de Documentos', 'Emitir e consultar NFe, NFCe e MDFe.');

INSERT INTO temas (dia_id, nome_tela, acessos) VALUES
((SELECT id FROM dias WHERE numero = 7 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Fiscal/NFe', 7821),
((SELECT id FROM dias WHERE numero = 7 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Fiscal/NFCe', 7821),
((SELECT id FROM dias WHERE numero = 7 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Fiscal/MDFe', 7821);

-- Dia 8: Relatórios e Dashboards
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 8, 'Relatórios e Dashboards', 'Interpretar dashboards de vendas, caixa, financeiro, estoque e relatórios gerenciais.');

INSERT INTO temas (dia_id, nome_tela, acessos) VALUES
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Dashboard/Vendas', 30762),
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Relatório/Vendas', 30762),
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Relatório/Caixa', 30762),
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Relatório/Estoque', 30762),
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Relatório/Financeiro', 30762),
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Relatório/Favoritos', 30762),
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Relatório/Fiscal', 30762),
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Dashboard/Financeiro a Receber', 30762),
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Dashboard/Financeiro a Pagar', 30762),
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Dashboard/Estoque', 30762),
((SELECT id FROM dias WHERE numero = 8 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Relatório/Cadastros', 30762);

-- Dia 9: Configurações e Acesso
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 9, 'Configurações e Acesso', 'Configurar o sistema, gerenciar acessos e autenticação.');

INSERT INTO temas (dia_id, nome_tela, acessos) VALUES
((SELECT id FROM dias WHERE numero = 9 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Acesso/Login', 58054),
((SELECT id FROM dias WHERE numero = 9 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Configuração/Geral', 58054),
((SELECT id FROM dias WHERE numero = 9 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Acesso/Cadastro de Usuário', 58054),
((SELECT id FROM dias WHERE numero = 9 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Configuração/Rápida', 58054),
((SELECT id FROM dias WHERE numero = 9 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Supervisão/Autorização Remota', 58054),
((SELECT id FROM dias WHERE numero = 9 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Configuração/Sistema', 58054),
((SELECT id FROM dias WHERE numero = 9 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Acesso/Negado', 58054),
((SELECT id FROM dias WHERE numero = 9 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Acesso/Recuperar Senha', 58054),
((SELECT id FROM dias WHERE numero = 9 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Configuração/Importar Dados', 58054);

-- Dia 10: Ferramentas Extras e Navegação Geral
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 10, 'Ferramentas Extras e Navegação Geral', 'Apresentar etiquetas, IA, integrações, contabilidade e páginas de navegação geral.');

INSERT INTO temas (dia_id, nome_tela, acessos) VALUES
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Navegação/Início', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Navegação/Raiz', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Etiqueta/Impressão', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Navegação/Novidades', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Etiqueta/Criar', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Navegação/Comprovante', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Etiqueta/Listagem', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Contabilidade/Arquivos XML', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'IA/Chat', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'IA/Insights', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Integração/LCPay', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'E-commerce/Catálogo Digital', 124822),
((SELECT id FROM dias WHERE numero = 10 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Marketplace/Amazon', 124822);

-- 3. Dias e Temas para LC ERP Desktop (4 dias, 20 temas)

-- Dia 1: Vendas
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop'), 1, 'Vendas', 'Operar PDV, atendimento no balcão e retaguarda de vendas.');

INSERT INTO temas (dia_id, nome_tela) VALUES
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Venda/PDV'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Venda/Atendimento Balcão'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Venda/Retaguarda');

-- Dia 2: Cadastros
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop'), 2, 'Cadastros', 'Cadastrar produtos, clientes, empresas, usuários, formas de pagamento e contabilista.');

INSERT INTO temas (dia_id, nome_tela) VALUES
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Cadastro/Produto'),
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Cadastro/Cliente'),
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Cadastro/Empresa'),
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Cadastro/Usuário'),
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Cadastro/Forma de Pagamento'),
((SELECT id FROM dias WHERE numero = 2 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Cadastro/Contabilista');

-- Dia 3: Estoque e Gestão
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop'), 3, 'Estoque e Gestão', 'Registrar entradas de estoque, acompanhar o dashboard, gerenciar multiempresa e configurar o PDV.');

INSERT INTO temas (dia_id, nome_tela) VALUES
((SELECT id FROM dias WHERE numero = 3 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Estoque/Entrada'),
((SELECT id FROM dias WHERE numero = 3 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Sistema/Dashboard'),
((SELECT id FROM dias WHERE numero = 3 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Sistema/Multiempresa'),
((SELECT id FROM dias WHERE numero = 3 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Configuração/PDV');

-- Dia 4: Fiscal
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop'), 4, 'Fiscal', 'Emitir e transmitir documentos fiscais e obrigações acessórias.');

INSERT INTO temas (dia_id, nome_tela) VALUES
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Fiscal/NF-e'),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Fiscal/NFC-e'),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Fiscal/MD-e'),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Fiscal/MDF-e'),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Fiscal/CT-e'),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Fiscal/Sintegra'),
((SELECT id FROM dias WHERE numero = 4 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC ERP Desktop')), 'Fiscal/Sped');

-- 4. Dias e Temas para Produtos (1 dia, 8 temas)

INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'Produtos'), 1, 'Portfolio de Produtos LC', 'Conhecer os produtos e integrações do ecossistema LC vendidos junto com o ERP.');

INSERT INTO temas (dia_id, nome_tela) VALUES
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'Produtos')), 'Produto/LC Pay'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'Produtos')), 'Produto/LC Força de Vendas'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'Produtos')), 'Produto/LC Gourmet'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'Produtos')), 'Produto/LC Balcão'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'Produtos')), 'Produto/LC Dashboard'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'Produtos')), 'Produto/LC Coletor de Dados'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'Produtos')), 'Produto/Smart TEF'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'Produtos')), 'Produto/Imendes');
