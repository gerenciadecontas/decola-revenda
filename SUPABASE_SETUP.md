# Setup Supabase - Guia Completo

## Passo 1: Criar Projetos Supabase

### 1.1 Acesse supabase.com
- Login com sua conta (crie se não tiver)
- Clique em "New Project"

### 1.2 Criar Projeto STAGING
- **Name:** decola-revenda-staging
- **Database Password:** (salve em local seguro)
- **Region:** São Paulo (sa-east-1)
- Clique "Create new project"

### 1.3 Criar Projeto PRODUCTION
- **Name:** decola-revenda-production
- **Database Password:** (salve em local seguro)
- **Region:** São Paulo (sa-east-1)
- Clique "Create new project"

---

## Passo 2: Copiar Credenciais

Para cada projeto, acesse Settings → API e copie:
- `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon/public key)

**Salve em local seguro ou password manager**

---

## Passo 3: Criar Tabelas (SQL)

Acesse cada projeto → SQL Editor → New Query

**Execute este SQL em AMBOS os projetos:**

```sql
-- Revendas
CREATE TABLE revendas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cidade TEXT,
  status TEXT DEFAULT 'ativo',
  responsavel TEXT,
  ultimo_contato DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Implantações
CREATE TABLE implantacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  revenda_id UUID REFERENCES revendas(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  progresso INTEGER DEFAULT 0,
  data_prevista DATE,
  status TEXT DEFAULT 'em-andamento',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pendências
CREATE TABLE pendencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  revenda_id UUID REFERENCES revendas(id) ON DELETE CASCADE,
  nivel TEXT NOT NULL,
  descricao TEXT,
  data_abertura DATE DEFAULT NOW(),
  status TEXT DEFAULT 'aberta',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Alertas
CREATE TABLE alertas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  prioridade TEXT NOT NULL,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agenda
CREATE TABLE agenda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  data DATE NOT NULL,
  hora TIME,
  tipo TEXT,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Treinamentos
CREATE TABLE treinamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  data_agendada DATE,
  status TEXT DEFAULT 'planejado',
  progresso INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS: Enable para todas as tabelas
ALTER TABLE revendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE implantacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE treinamentos ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow all for authenticated users
CREATE POLICY "Allow all for authenticated users" ON revendas
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow all for authenticated users" ON implantacoes
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow all for authenticated users" ON pendencias
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow all for authenticated users" ON alertas
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow all for authenticated users" ON agenda
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow all for authenticated users" ON treinamentos
  FOR ALL USING (TRUE) WITH CHECK (TRUE);
```

---

## Passo 4: Configurar Variáveis de Ambiente

### No Vercel (Produção)
- Project: `decola-revenda`
- Settings → Environment Variables
- Adicione:
  ```
  NEXT_PUBLIC_SUPABASE_URL = (URL do projeto production)
  NEXT_PUBLIC_SUPABASE_ANON_KEY = (key do projeto production)
  ```

### No Vercel (Staging)
- Project: `decola-revenda-staging` (crie novo se não existir)
- Settings → Environment Variables
- Adicione:
  ```
  NEXT_PUBLIC_SUPABASE_URL = (URL do projeto staging)
  NEXT_PUBLIC_SUPABASE_ANON_KEY = (key do projeto staging)
  ```

### Localmente (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx-staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## Passo 5: Verificação

- [ ] Projeto staging criado no Supabase
- [ ] Projeto production criado no Supabase
- [ ] Tabelas criadas em ambos
- [ ] Variáveis de ambiente configuradas
- [ ] RLS policies ativadas

**Próximo:** Aguarde o código ser atualizado para usar Supabase!
