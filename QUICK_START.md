# Quick Start — Decola Revenda em 15 Minutos

## 1️⃣ Criar Projeto Supabase (3 min)

1. Acesse [supabase.com](https://supabase.com)
2. Clique "New Project"
3. Preencha:
   - **Name**: `decola-revenda`
   - **Password**: escolha uma forte
   - **Region**: sa-east-1 (São Paulo)
4. Aguarde criação (pode levar 2-3 min)

## 2️⃣ Copiar Chaves (1 min)

No painel do Supabase, vá para **Settings > API** e copie:

```
NEXT_PUBLIC_SUPABASE_URL = [Project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [API Key - anon]
SUPABASE_SERVICE_ROLE_KEY = [API Key - service_role]
```

## 3️⃣ Configurar .env.local (1 min)

Na raiz do projeto, crie `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<cola aqui>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<cola aqui>
SUPABASE_SERVICE_ROLE_KEY=<cola aqui>
```

## 4️⃣ Executar Migrations (3 min)

1. No Supabase, vá para **SQL Editor** > "+ New Query"
2. Abra o arquivo `supabase/migrations/0001_schema.sql`
3. Copie TODO o conteúdo e cole na aba SQL
4. Clique "Run"

Pronto! Schema criado com RLS policies.

## 5️⃣ Fazer Seed de Dados (2 min)

1. Ainda em **SQL Editor**, crie novo query
2. Abra `supabase/seed.sql`
3. Copie TODO o conteúdo e cole
4. Clique "Run"

Pronto! Trilhas (LC WEB, ERP, Produtos), dias, e temas inseridos.

## 6️⃣ Criar Usuários de Teste (3 min)

### Usuário Admin

1. Em **Authentication > Users** > "Create new user"
2. Email: `admin@lcsistemas.com.br`
3. Password: escolha uma (ex: Admin@123456)
4. Email confirmation: habilitar (ou desabilitar para teste)
5. Clique "Create user"

6. Depois, em **SQL Editor**, execute:
```sql
INSERT INTO profiles (id, email, full_name, role) 
SELECT id, email, 'Administrador LC', 'admin' FROM auth.users WHERE email = 'admin@lcsistemas.com.br';
```

### Usuário Gestor

1. Repita o processo acima com:
2. Email: `gestor@lcsistemas.com.br`
3. Password: escolha uma

4. Execute:
```sql
INSERT INTO profiles (id, email, full_name, role) 
SELECT id, email, 'Gestor Canal', 'gestor' FROM auth.users WHERE email = 'gestor@lcsistemas.com.br';
```

## 7️⃣ Rodar Localmente (2 min)

```bash
cd decola-revenda
npm install
npm run dev
```

Acesse http://localhost:3000

## 8️⃣ Testar! (? min)

### Como Admin:
1. Login: `admin@lcsistemas.com.br` / sua_senha
2. Você já está no Dashboard (você é admin)
3. Clique "Gerenciar Revendas"
4. Clique "+ Adicionar Revenda"
5. Preencha:
   - Nome: "Revenda Teste ABC"
   - CNPJ: "12.345.678/0001-90"
   - Trilha: "LC WEB"
   - Gestor Responsável: "Gestor Canal"
   - Status: "ativa"
6. Clique "Criar Revenda"
7. Volte ao Dashboard — veja a revenda na tabela

### Como Gestor:
1. Logout (clique logout se houver, senão delete cookies)
2. Login: `gestor@lcsistemas.com.br` / sua_senha
3. Você vê "Minhas Revendas" com a revenda criada acima
4. Clique na revenda
5. Marque alguns checkboxes nos temas
6. Volte ao dashboard admin (outra aba) e recarregue — as marcas aparecem!

## ✅ Pronto!

Você tem uma plataforma totalmente funcional de monitoramento de treinamentos.

### Próximas ações recomendadas:

- [ ] Adicionar mais revendas de teste
- [ ] Testar criar vários gestores
- [ ] Usar em produção (deploy na Vercel)
- [ ] Ler [SETUP.md](SETUP.md) para detalhes
- [ ] Ler [ARCHITECTURE.md](ARCHITECTURE.md) para entender o sistema

## 🆘 Dúvidas Frequentes

**P: Posso usar banco de dados que já existe?**  
R: Sim! Você pode rodar as migrations em qualquer Supabase. Elas criam tabelas novas sem afetar existentes.

**P: Posso mudar as cores/UI?**  
R: Sim! O projeto usa Tailwind CSS. Edite componentes em `components/` e pages em `app/`.

**P: Como adicionar mais revendas em massa?**  
R: Abra SQL Editor e execute INSERT INTO revendas (...) VALUES (...), ou use a UI.

**P: Posso exportar dados?**  
R: Sim, no Supabase SQL Editor você pode fazer SELECT * FROM revendas e copiar.

**P: O que é RLS?**  
R: Row Level Security — Gestor automaticamente vê só suas revendas (segurança no banco, não só no app).

---

Se tudo deu certo, parabéns! 🎉 Sua plataforma está rodando.

Para mais detalhes, veja [README.md](README.md) e [SETUP.md](SETUP.md).
