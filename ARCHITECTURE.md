# Arquitetura da Plataforma Decola Revenda

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                      NAVEGADOR (Cliente)                         │
│                    React + Next.js App Router                    │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Login      │  │   Dashboard  │  │   Gestão    │          │
│  │   /login     │  │  /dashboard  │  │  /admin     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                │                  │                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Minhas       │  │ Dashboard    │  │ CRUD        │          │
│  │ Revendas     │  │ Comparativo  │  │ Revendas    │          │
│  │ /gestor      │  │ /admin       │  │ /admin      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                │                  │                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │       CronogramaAccordion (Componente Reutilizável)     │  │
│  │  - Exibe dias, temas, checkboxes                        │  │
│  │  - Modo edição (Gestor) ou read-only (Admin)            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │ HTTPS
                     Supabase Client
                (auth + realtime queries)
                            │
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                            │
│                   PostgreSQL + Auth + RLS                       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            Authentication (Supabase Auth)               │   │
│  │  - Email/Senha                                          │   │
│  │  - JWT tokens + cookies                                │   │
│  │  - Gerenciar usuários                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│  ┌────────────────┬────────────────┬──────────────────────┐    │
│  │   Tabelas      │   RLS Policies │   Índices            │    │
│  │                │                │                      │    │
│  │ - trilhas      │ - Admin (all)  │ - trilha_id          │    │
│  │ - dias         │ - Gestor (own) │ - dia_id             │    │
│  │ - temas        │ - Public (read)│ - revenda_id         │    │
│  │ - revendas     │                │ - tema_id            │    │
│  │ - progresso    │                │ - revenda_tema (PK)  │    │
│  │ - profiles     │                │                      │    │
│  └────────────────┴────────────────┴──────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          API Real-time (Supabase Realtime)              │   │
│  │  - Notificações de mudanças em progresso               │   │
│  │  - Sincronização entre abas/dispositivos               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados

### Fluxo 1: Gestor Marca Progresso

```
Gestor clica checkbox (UI)
    ↓
  [/gestor/revendas/[id]/page.tsx] 
    ↓
handleProgressoChange()
    ↓
supabase.from('progresso').update/insert()
    ↓
[Backend] RLS valida: gestor_responsavel_id = auth.uid() ✓
    ↓
INSERT/UPDATE em progresso (revenda_id, tema_id, concluido, concluido_em)
    ↓
Realtime API notifica clientes subscritos
    ↓
[/admin/dashboard] atualiza tabela em tempo real
    ↓
Percentual de conclusão recalculado
```

### Fluxo 2: Admin Visualiza Dashboard

```
Admin acessa /admin/dashboard
    ↓
[server-side] createClient().from('revendas').select(...)
    ↓
[Backend] RLS valida: (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' ✓
    ↓
JOIN com trilhas, profiles, progresso
    ↓
Calcula stats:
  - totalTemas por trilha
  - concluidos por revenda
  - percentual, diasSemAtividade
    ↓
HTML renderizado com dados reais
    ↓
Tabela comparativa exibida
```

### Fluxo 3: Admin Edita Revenda

```
Admin clica "Editar" em revenda
    ↓
[/admin/revendas/page.tsx] formulário pré-preenchido
    ↓
handleSubmit()
    ↓
supabase.from('revendas').update()
    ↓
[Backend] RLS: admin ✓
    ↓
UPDATE revendas (nome, cnpj, trilha_id, gestor_responsavel_id, status)
    ↓
reload de dados via loadData()
    ↓
Tabela de revendas atualizada
```

## Arquitetura de Autenticação e Autorização

```
┌─────────────────────────────────────────────────────────┐
│              Supabase Auth (JWT)                        │
│   - Email/Senha → JWT token armazenado em cookie      │
│   - Refresh automático (token expiração)              │
└─────────────────────────────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────────────────┐
│     Middleware / Route Guards (Client & Server)         │
│                                                         │
│  app/page.tsx → getCurrentUser()                       │
│    ├─ sem user → redirect /login                      │
│    └─ com user → redirect /dashboard                  │
│                                                         │
│  app/dashboard/page.tsx → getUserProfile()             │
│    ├─ role = 'admin' → /admin/dashboard               │
│    └─ role = 'gestor' → /gestor/revendas              │
│                                                         │
│  /admin/* → verifica role = 'admin'                    │
│  /gestor/* → verifica role = 'gestor'                  │
└─────────────────────────────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────────────────┐
│     Row Level Security (RLS) no PostgreSQL              │
│                                                         │
│  SELECT * FROM revendas                               │
│    WHERE gestor_responsavel_id = auth.uid()           │
│    OR (SELECT role FROM profiles) = 'admin'           │
│                                                         │
│  UPDATE progresso                                       │
│    WHERE EXISTS(                                        │
│      SELECT 1 FROM revendas                            │
│      WHERE revenda_id = revenda.id                     │
│      AND gestor_responsavel_id = auth.uid()            │
│    )                                                    │
└─────────────────────────────────────────────────────────┘
```

## Estrutura do Banco de Dados

```sql
-- Tabelas principais e relacionamentos

profiles (users)
├── id (UUID, FK: auth.users)
├── email (TEXT, UNIQUE)
├── full_name (TEXT)
├── role (TEXT: 'admin' | 'gestor')

trilhas
├── id (UUID, PK)
├── nome (TEXT, UNIQUE: 'LC WEB', 'LC ERP Desktop', 'Produtos')

dias
├── id (UUID, PK)
├── trilha_id (FK: trilhas)
├── numero (INT: 1-10 para LC WEB, 1-4 para ERP)
├── titulo (TEXT)
├── objetivo (TEXT)
├── UNIQUE(trilha_id, numero)

temas
├── id (UUID, PK)
├── dia_id (FK: dias)
├── nome_tela (TEXT: 'Cadastro/Produto', 'Venda/PDV', etc.)

revendas
├── id (UUID, PK)
├── nome (TEXT)
├── cnpj (TEXT, UNIQUE, nullable)
├── status (TEXT: 'ativa' | 'pausada' | 'concluida')
├── trilha_id (FK: trilhas)
├── gestor_responsavel_id (FK: profiles, nullable)
├── data_inicio (DATE)

progresso
├── id (UUID, PK)
├── revenda_id (FK: revendas)
├── tema_id (FK: temas)
├── concluido (BOOLEAN)
├── concluido_em (TIMESTAMP, nullable)
├── concluido_por (FK: profiles, nullable)
├── UNIQUE(revenda_id, tema_id) — uma linha por revenda/tema
```

## Deployment

```
┌──────────────────────────────────────────────────────┐
│              GitHub Repository                       │
│  - Code pushed (main branch)                        │
│  - CI/CD trigger                                    │
└──────────────────────────────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────────────────┐
│              Vercel (Next.js Host)                   │
│  - Automatic build & deploy                         │
│  - Environment variables (.env.production)          │
│  - Edge functions (optional)                        │
│  - Analytics & logs                                 │
└──────────────────────────────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────────────────┐
│       Supabase (Database & Auth as a Service)        │
│  - PostgreSQL managed                               │
│  - Daily backups                                    │
│  - Automatic scaling                                │
│  - 99.9% SLA                                        │
└──────────────────────────────────────────────────────┘
```

## Performance & Escalabilidade

### Para 50+ Revendas

- **Índices**: `(revenda_id, tema_id)` em progresso para queries rápidas
- **Paginação**: Dashboard usa server-side rendering com limit/offset (opcional)
- **Caching**: Vercel cache estático para páginas que mudam pouco
- **CDN**: Assets CSS/JS servidos via Vercel Edge Network
- **Database**: PostgreSQL com connection pooling no Supabase

### Otimizações Futuras

- Materialized views para stats pré-calculadas
- Redis para cache de dashboard (se usar upgrade)
- GraphQL vs REST (atualmente REST via Supabase JS client)
- Batch operations para seed/import em massa

## Segurança

- ✅ **HTTPS/TLS**: Vercel + Supabase automáticos
- ✅ **CORS**: Supabase CORS configurado
- ✅ **SQL Injection**: Supabase parameterized queries (client) + RLS (server)
- ✅ **XSS**: React escapa HTML, Tailwind não permite estilos inline maliciosos
- ✅ **CSRF**: Supabase cookies SameSite + Next.js CSRF middleware (futuro)
- ✅ **JWT expiration**: Supabase refresh automático
- ✅ **Data isolation**: RLS garante Gestor só vê suas revendas
- ✅ **Password hashing**: Supabase bcrypt
- ⚠️ **Rate limiting**: Supabase free tier + plano pago com proteção

## Melhorias Arquiteturais (Roadmap)

1. **API Route Handlers** para operações críticas (admin-only endpoints)
2. **Middleware** para validação de roles antes de renderizar página
3. **Caching com SWR/React Query** para revalidação automática
4. **WebSocket realtime** para dashboard live updates (Supabase Realtime)
5. **File uploads** para anexar materiais de treinamento (Supabase Storage)
6. **Audit logs** — registrar quem marcou e quando (tabela audit_logs)
7. **Two-factor authentication** para admin
8. **Rate limiting** nas rotas de mutação
