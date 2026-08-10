# Decola Revenda - Plataforma de Monitoramento de Treinamentos

Uma plataforma completa de monitoramento de treinamentos diários para revendas, com rastreamento de progresso por trilha (LC WEB, LC ERP Desktop, Produtos), dashboard comparativo entre revendas e gestão de papéis (Admin e Gestor de Canal).

## Características Principais

✅ **Multi-revenda**: Acompanhe 50+ revendas simultaneamente  
✅ **Cronograma estruturado**: 10 dias para LC WEB, 4 para ERP Desktop, 1 para Produtos  
✅ **Checklist de temas**: Marque o progresso de cada tela/tema de treinamento  
✅ **Dashboard comparativo**: Visualize em tempo real o andamento de todas as revendas  
✅ **Papéis de usuário**: Admin (gerencia tudo) + Gestor de Canal (marca progresso)  
✅ **Autenticação segura**: Supabase Auth com email/senha  
✅ **Row Level Security**: Gestores só veem suas revendas atribuídas  
✅ **Indicadores de alerta**: Revendas paradas há dias sem atividade  

## Stack Tecnológico

- **Frontend**: React 18 + Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Hospedagem**: Vercel (recomendado para Next.js)
- **Language**: TypeScript

## Estrutura do Projeto

```
decola-revenda/
├── app/
│   ├── page.tsx                      # Página inicial (redireciona para dashboard)
│   ├── login/
│   │   └── page.tsx                  # Tela de login
│   ├── dashboard/
│   │   └── page.tsx                  # Router inteligente (admin/gestor)
│   ├── gestor/
│   │   └── revendas/
│   │       ├── page.tsx              # Lista de revendas do gestor
│   │       └── [id]/
│   │           └── page.tsx          # Detalhe da revenda (cronograma)
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard comparativo
│   │   └── revendas/
│   │       ├── page.tsx              # CRUD de revendas
│   │       └── [id]/
│   │           └── page.tsx          # Detalhe da revenda (read-only)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── CronogramaAccordion.tsx       # Componente reutilizável de cronograma
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Cliente do Supabase (browser)
│   │   └── server.ts                 # Cliente do Supabase (server)
│   ├── auth.ts                       # Utilitários de autenticação
│   └── types.ts                      # Tipos TypeScript
├── supabase/
│   ├── migrations/
│   │   └── 0001_schema.sql           # Schema do banco de dados
│   └── seed.sql                      # Dados iniciais (trilhas, dias, temas)
├── SETUP.md                          # Guia de setup completo
└── package.json
```

## Como Começar

### 1. Clone/Navegue para o Diretório

```bash
cd c:\Users\dilna\Documents\GC\PROJETO\IMPLANTAÇÃO\decola-revenda
```

### 2. Configure as Variáveis de Ambiente

Crie um arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

Veja [SETUP.md](SETUP.md) para instruções completas de como obter essas chaves.

### 3. Instale Dependências

```bash
npm install
```

### 4. Configure o Banco de Dados

Execute os scripts SQL:
- `supabase/migrations/0001_schema.sql` — Schema e políticas RLS
- `supabase/seed.sql` — Trilhas, dias, temas e dados iniciais

Veja [SETUP.md](SETUP.md) passo a passo.

### 5. Rode Localmente

```bash
npm run dev
```

Acesse http://localhost:3000

## Fluxos de Uso

### Gestor de Canal

1. Faz login com suas credenciais
2. Acessa "Minhas Revendas" — lista de revendas atribuídas a ele
3. Clica em uma revenda para abrir o cronograma
4. Marca as telas/temas concluídos durante o treinamento diário
5. Progresso é salvo automaticamente no banco de dados
6. Admin acompanha em tempo real no dashboard

### Admin (Você)

1. Faz login com suas credenciais (role = `admin`)
2. Acessa o **Dashboard de Monitoramento** — visão geral de todas as revendas
3. Visualiza:
   - Total de revendas, ativas, concluídas
   - Progresso médio geral
   - Tabela comparativa com % de conclusão, dias sem atividade, etc.
4. Clica em "Ver detalhe" para inspecionar uma revenda específica (modo read-only)
5. Acessa **Gerenciar Revendas** para CRUD:
   - Criar nova revenda
   - Atribuir a um gestor
   - Editar dados (nome, CNPJ, status, trilha)
   - Deletar se necessário

## Modelo de Dados

### Tabelas Principais

- **`trilhas`** — LC WEB, LC ERP Desktop, Produtos
- **`dias`** — 1-10 para LC WEB, 1-4 para ERP, 1 para Produtos
- **`temas`** — Telas/topics específicas (ex: "Cadastro/Produto")
- **`revendas`** — Clientes em treinamento, com trilha + gestor responsável
- **`progresso`** — Linha de conclusão por revenda × tema (2 colunas de chave)
- **`profiles`** — Usuários com role (admin | gestor)

### Row Level Security (RLS)

- **Gestor** → vê apenas progresso de revendas onde `gestor_responsavel_id = seu_id`
- **Admin** → vê e edita tudo
- **Público (leitura)** → todos podem ler `trilhas`, `dias`, `temas`

## Indicadores e Alertas

O dashboard do admin mostra automaticamente:

- **Percentual de conclusão** por revenda (barra de progresso)
- **Dias sem atividade** — quantos dias passaram desde a última marca de tema
- **Status visual** — vermelho (parado 7+ dias), amarelo (parado 1-7 dias)
- **Média de progresso geral** — % médio de todas as revendas

## Próximos Passos (Melhorias Futuras)

1. **Exportação de relatórios** (CSV/PDF) de progresso por período
2. **Notificações por email** — alerta quando revenda fica parada
3. **Histórico de quem marcou** — timestamp + user_id em cada conclusão
4. **Filtros avançados** no dashboard (por trilha, status, gestor, intervalo de datas)
5. **Gráficos e analytics** — taxa de conclusão ao longo do tempo
6. **Temas multimídia** — adicionar links a vídeos/materiais de treinamento
7. **App mobile** — React Native para os gestores marcarem em campo

## Troubleshooting

### "Erro 401: Unauthorized"
- Verifique as chaves do Supabase em `.env.local`
- Confirme que o usuário foi criado no Supabase Auth

### "Revenda não encontrada"
- Verifique o ID da URL
- Confirme que você tem acesso (Admin ou Gestor atribuído)

### "Row Level Security" policy violation
- Certifique-se de que as migrations foram executadas
- Se for Gestor, a revenda deve ter `gestor_responsavel_id = seu_id`

## Contato & Suporte

Para dúvidas ou problemas com a plataforma, entre em contato com o administrador do projeto.

---

**Versão**: 1.0.0  
**Data de Criação**: Agosto 2026  
**Status**: Em desenvolvimento (Fase 1 completa)
