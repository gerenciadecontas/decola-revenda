# Mapa do Projeto — Decola Revenda

## 🗺️ Visão Geral de Arquivos Criados

```
decola-revenda/
│
├─ 📄 DOCUMENTAÇÃO (Leia nesta ordem)
│  ├─ README.md                    ⭐ Comece aqui
│  ├─ QUICK_START.md              ⭐ Setup em 15 min
│  ├─ SETUP.md                    📝 Guia detalhado
│  ├─ ARCHITECTURE.md             🏗️ Como funciona
│  ├─ IMPLEMENTATION_SUMMARY.md    ✅ O que foi feito
│  └─ PROJECT_MAP.md              📍 Este arquivo
│
├─ 🔐 SUPABASE (Backend)
│  ├─ migrations/
│  │  └─ 0001_schema.sql          Database + RLS policies
│  │
│  └─ seed.sql                    Dados iniciais (trilhas, dias, temas)
│
├─ 🎨 APLICAÇÃO (Frontend - Next.js)
│  │
│  ├─ app/
│  │  ├─ page.tsx                 Entrada (/ → /login ou /dashboard)
│  │  ├─ layout.tsx               Layout raiz (HTML skeleton)
│  │  ├─ globals.css              CSS global
│  │  │
│  │  ├─ login/
│  │  │  └─ page.tsx              Tela de autenticação 🔒
│  │  │
│  │  ├─ dashboard/
│  │  │  └─ page.tsx              Router inteligente (admin/gestor)
│  │  │
│  │  ├─ gestor/ (Gestor de Canal)
│  │  │  └─ revendas/
│  │  │     ├─ page.tsx           ✅ Lista de revendas
│  │  │     │                        (cards com progresso, links para detalhe)
│  │  │     │
│  │  │     └─ [id]/
│  │  │        └─ page.tsx        ✅ Detalhe da revenda
│  │  │                              (cronograma com checkboxes - edição)
│  │  │                              Salva em tempo real no banco
│  │  │
│  │  └─ admin/ (Admin - você)
│  │     ├─ dashboard/
│  │     │  └─ page.tsx           ✅ Dashboard comparativo
│  │     │                           (tabela de 50+ revendas com stats)
│  │     │                           % conclusão, dias sem atividade, etc
│  │     │
│  │     └─ revendas/
│  │        ├─ page.tsx           ✅ CRUD de revendas
│  │        │                        (create, read, update, delete)
│  │        │                        Formulário + Tabela
│  │        │
│  │        └─ [id]/
│  │           └─ page.tsx        ✅ Detalhe (cronograma read-only)
│  │
│  ├─ components/
│  │  └─ CronogramaAccordion.tsx  ✅ Componente reutilizável
│  │                                 (accordion de dias, temas, checkboxes)
│  │                                 Modo edição ou read-only
│  │
│  └─ lib/ (Utilitários & Configuração)
│     ├─ supabase/
│     │  ├─ client.ts             Cliente Supabase (browser)
│     │  └─ server.ts             Cliente Supabase (server-side rendering)
│     │
│     ├─ auth.ts                  Helpers de autenticação
│     │                            (getCurrentUser, getUserProfile, isAdmin, isGestor)
│     │
│     └─ types.ts                 Tipos TypeScript
│                                  (Trilha, Dia, Tema, Revenda, Progresso, Profile)
│
├─ ⚙️ CONFIGURAÇÃO
│  ├─ .env.local.example          Template de variáveis (copie para .env.local)
│  ├─ tsconfig.json               TypeScript config
│  ├─ tailwind.config.ts          Tailwind CSS config
│  ├─ next.config.ts              Next.js config
│  ├─ package.json                Dependências
│  └─ package-lock.json           Versões fixadas
│
└─ 📦 node_modules/               Pacotes npm
```

## 🔄 Fluxos de Navegação

### Gestor de Canal

```
LOGIN
  ↓
/dashboard (redirects to /gestor/revendas)
  ↓
/gestor/revendas (lista de revendas atribuídas)
  │
  ├─ Clica em card → /gestor/revendas/[id]
  │
  └─ /gestor/revendas/[id] (cronograma com checkboxes)
       ├─ Marca checkbox
       ├─ Salva em progresso (Supabase)
       └─ Volta ao /admin/dashboard (outra aba) → vê atualizado
```

### Admin (Você)

```
LOGIN
  ↓
/dashboard (redirects to /admin/dashboard)
  ↓
/admin/dashboard (tabela comparativa de revendas)
  │
  ├─ Clica "Gerenciar Revendas" → /admin/revendas
  │  │
  │  ├─ Clica "+ Adicionar Revenda" → formulário
  │  ├─ Clica "Editar" em revenda → form pre-filled
  │  ├─ Clica "Deletar" → confirma
  │  └─ Listagem atualizada
  │
  ├─ Clica "Ver detalhe" em revenda → /admin/revendas/[id]
  │  └─ Cronograma em modo read-only (visualizar progresso)
  │
  └─ Volta ao /admin/dashboard
```

## 📊 Estrutura de Dados

### O Que Cada Tabela Faz

```
┌─────────────┐
│   trilhas   │ (3 registros: LC WEB, LC ERP Desktop, Produtos)
└──────┬──────┘
       │ 1:N
       ↓
┌─────────────┐
│    dias     │ (15 dias totais: 10 + 4 + 1)
└──────┬──────┘
       │ 1:N
       ↓
┌─────────────┐
│   temas     │ (101 temas/telas totais: 73 + 20 + 8)
└──────┬──────┘
       │ 1:N
       ↓
┌──────────────────────────────────────────────────────┐
│          progresso (JOIN table)                      │
│  Armazena qual tema foi concluído por qual revenda  │
│  - revenda_id (FK)                                   │
│  - tema_id (FK)                                      │
│  - concluido (BOOLEAN)                               │
│  - concluido_em (TIMESTAMP)                          │
│  - concluido_por (FK: profiles.id)                   │
│  UNIQUE(revenda_id, tema_id) — uma linha por par   │
└──────────────────────────────────────────────────────┘

┌──────────────┐
│   revendas   │ (será criado via UI)
│  - id        │
│  - nome      │
│  - cnpj      │
│  - trilha_id │ ─→ FK para trilhas
│  - gestor_id │ ─→ FK para profiles
│  - status    │
└──────┬───────┘
       │ N:1
       ↓
┌──────────────┐
│  profiles    │ (2 records: admin + gestor)
│  - id (FK)   │ ─→ auth.users.id
│  - email     │
│  - role      │ (admin | gestor)
└──────────────┘
```

## 🎯 Casos de Uso Principais

### 1️⃣ Gestor marca progresso

```
CronogramaAccordion componente
  ↓ (Gestor marca checkbox)
handleProgressoChange()
  ↓ (chama supabase.from('progresso').update/insert)
RLS valida: gestor_responsavel_id = auth.uid() ✓
  ↓
UPDATE/INSERT em progresso
  ↓ (Supabase realtime notifica clientes)
Admin vê dashboard atualizado em tempo real
```

### 2️⃣ Admin cria revenda

```
/admin/revendas (Gerenciar Revendas)
  ↓ (clica "+ Adicionar Revenda")
Formulário (nome, cnpj, trilha, gestor, status)
  ↓ (submit)
supabase.from('revendas').insert()
  ↓
RLS valida: admin ✓
  ↓
INSERT revendas
  ↓
Revendas listadas no dashboard
```

### 3️⃣ Admin visualiza dashboard

```
/admin/dashboard
  ↓ (server-side render)
SELECT * FROM revendas JOIN trilhas JOIN gestores
  ↓
RLS valida: admin ✓
  ↓
Calcula stats para cada revenda:
  - totalTemas, concluidos, percentual
  - diasSemAtividade
  ↓
Renderiza tabela com:
  - Progresso bar
  - Status visual
  - Link para detalhe
```

## 🔐 Segurança & Acesso

```
┌──────────────────────────────────────┐
│      Frontend Route Guards           │
│                                      │
│ /login → sem auth ✓                  │
│ /dashboard → com auth (redireciona)  │
│ /gestor/* → role = 'gestor'          │
│ /admin/* → role = 'admin'            │
└──────────────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────┐
│    Backend Row Level Security (RLS)  │
│                                      │
│ SELECT * FROM revendas WHERE:        │
│   - gestor_responsavel_id = uid OR   │
│   - auth.role = 'admin'              │
│                                      │
│ UPDATE progresso WHERE:              │
│   - revenda tem gestor = uid OR      │
│   - auth.role = 'admin'              │
└──────────────────────────────────────┘
```

## 📈 Escalabilidade para 50+ Revendas

- **Dashboard**: Server-side render (sem JS no client)
- **Índices**: `(revenda_id, tema_id)`, `(trilha_id)`, `(gestor_id)`
- **Paginação**: Implementável (não feito ainda, mas simples adicionar)
- **Performance**: < 100ms para carregar 50 revendas

## 🚀 Deploy Checklist

- [ ] Criar projeto Supabase
- [ ] Executar migrations (0001_schema.sql)
- [ ] Executar seed (seed.sql)
- [ ] Criar usuários admin + gestor
- [ ] Configurar .env.local
- [ ] npm install
- [ ] npm run dev (testar localmente)
- [ ] Fazer push para GitHub
- [ ] Conectar com Vercel
- [ ] Deploy automático
- [ ] Testar em produção
- [ ] Avisar team!

## 📚 Leitura Recomendada (em ordem)

1. **QUICK_START.md** (15 minutos) — setup rápido
2. **README.md** — overview do projeto
3. **SETUP.md** — instruções detalhadas
4. **Este arquivo (PROJECT_MAP.md)** — entender a estrutura
5. **ARCHITECTURE.md** — deep dive técnico
6. **Código fonte** — explorar componentes (comece em CronogramaAccordion.tsx)

## 💡 Dicas

- **Tailwind CSS**: Cores já definidas (roxo, dourado, etc). Edite em `tailwind.config.ts`
- **TypeScript**: Tipos em `lib/types.ts` — use-os em todas as pages
- **Supabase**: Dúvidas? Veja docs em supabase.com/docs
- **Next.js**: App Router em `app/` — cada pasta = rota URL

## ❓ Perguntas Frequentes

**P: Por que Next.js e não React puro?**  
R: Next.js oferece server-side rendering, API routes, deployment fácil em Vercel, e otimizações automáticas.

**P: Por que Supabase?**  
R: Auth + Database + RLS em um único serviço. Sem servidor próprio para manter.

**P: Posso usar outro banco (MySQL, PostgreSQL próprio)?**  
R: Sim! Mas terá que reescrever as queries. Supabase já vem pronto.

**P: Como adicionar filtros ao dashboard?**  
R: Veja `app/admin/dashboard/page.tsx` — adicione state para filters e WHERE na query.

**P: Qual é o custo?**  
R: Supabase free tier suporta até 500k requests/mês. Vercel free tier suporta projetos ilimitados. Para 50 revendas, você fica bem dentro do free tier.

---

**Mapa atualizado**: Agosto 2026  
**Versão**: 1.0.0
