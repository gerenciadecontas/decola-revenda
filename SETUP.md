# Setup da Plataforma Decola Revenda

## 1. Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Preencha os dados:
   - **Project Name**: `decola-revenda`
   - **Database Password**: Crie uma senha forte
   - **Region**: Selecione a região mais próxima do Brasil (geralmente `sa-east-1` - São Paulo)
5. Aguarde o projeto ser criado (pode levar 2-3 minutos)

## 2. Configurar Variáveis de Ambiente

1. No painel do Supabase, vá para **Settings > API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Key (anon)** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API Key (service_role)** → `SUPABASE_SERVICE_ROLE_KEY`

3. Crie um arquivo `.env.local` na raiz do projeto e adicione:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

## 3. Executar Migrations

1. No Supabase, vá para **SQL Editor**
2. Clique em "+ New Query"
3. Copie e cole todo o conteúdo do arquivo `supabase/migrations/0001_schema.sql`
4. Clique em "Run" para executar

## 4. Seedar Dados Iniciais

Crie e execute uma query SQL com o seguinte conteúdo:

```sql
-- Inserir trilhas
INSERT INTO trilhas (nome, descricao) VALUES
('LC WEB', 'Sistema LC WEB - versão web do ERP'),
('LC ERP Desktop', 'Sistema LC ERP Desktop - versão desktop'),
('Produtos', 'Portfolio de produtos e integrações LC');

-- Inserir dias para LC WEB (exemplo para dia 1)
INSERT INTO dias (trilha_id, numero, titulo, objetivo) VALUES
((SELECT id FROM trilhas WHERE nome = 'LC WEB'), 1, 'Cadastro de Produtos', 'Dominar o cadastro, edição e organização de produtos – a tela mais acessada do sistema.');

-- Inserir temas para o dia 1 de LC WEB
INSERT INTO temas (dia_id, nome_tela) VALUES
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Produto'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Categoria'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Subcategoria'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Unidade'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Grade de Produtos'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Tabela de Preços'),
((SELECT id FROM dias WHERE numero = 1 AND trilha_id = (SELECT id FROM trilhas WHERE nome = 'LC WEB')), 'Cadastro/Promoção');
```

## 5. Criar Usuários de Teste

No Supabase, vá para **Authentication > Users** e crie:

1. **Admin**
   - Email: `admin@lcsistemas.com.br`
   - Senha: Escolha uma segura
   - Após criar, execute na aba SQL:
   ```sql
   INSERT INTO profiles (id, email, full_name, role) 
   SELECT id, email, 'Administrador', 'admin' FROM auth.users WHERE email = 'admin@lcsistemas.com.br';
   ```

2. **Gestor de Teste**
   - Email: `gestor@lcsistemas.com.br`
   - Senha: Escolha uma segura
   - Após criar, execute na aba SQL:
   ```sql
   INSERT INTO profiles (id, email, full_name, role) 
   SELECT id, email, 'Gestor Teste', 'gestor' FROM auth.users WHERE email = 'gestor@lcsistemas.com.br';
   ```

## 6. Instalar Dependências e Rodar Localmente

```bash
cd decola-revenda
npm install
npm run dev
```

Acesse http://localhost:3000

## 7. Fazer Login

- **Admin**: `admin@lcsistemas.com.br`
- **Gestor**: `gestor@lcsistemas.com.br`

## Próximos Passos

### Completar o Seed de Dados

A query SQL acima é apenas um exemplo. Para completar:
1. Use o arquivo `cronograma-treinamento-telas.html` como referência
2. Insira manualmente todos os dias (1-10 para LC WEB, 1-4 para ERP Desktop, etc.)
3. Insira todos os temas/telas de cada dia

### Criar Revendas

1. Faça login como admin em http://localhost:3000/admin/revendas
2. Clique em "+ Adicionar Revenda"
3. Preencha os dados e atribua a um gestor

### Deploy na Vercel

1. Faça push do código para GitHub
2. Conecte no Vercel (vercel.com)
3. Configure as variáveis de ambiente no painel do Vercel
4. Deploy automático

## Troubleshooting

### Erro: "Row Level Security" policy
- Verifique se todas as migrations foram executadas corretamente
- Cheque se as policies RLS estão habilitadas na aba "Authentication > Policies"

### Erro: "Usuário não encontrado na aba profiles"
- Certifique-se de que executou as queries de INSERT na aba profiles para cada usuário criado

### Checkout: "CNPJ duplicado"
- Se tentar criar duas revendas com o mesmo CNPJ, será bloqueado por constraint único. Use CNPJs diferentes ou deixe em branco.
