-- =====================================================================
-- Decola Revenda · 0002 · Tabelas da plataforma + correção de segurança
-- Seguro para rodar mais de uma vez. Não apaga dados existentes.
-- =====================================================================

-- ---------------------------------------------------------------------
-- PARTE 1 · Corrige o "loop infinito" nas regras da tabela profiles
-- As regras antigas consultavam a própria profiles para saber se o
-- usuário é admin. Esta função faz essa checagem sem passar pelas regras.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- Remove todas as regras atuais de profiles, revendas e progresso
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN ('profiles', 'revendas', 'progresso')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- Recria as mesmas regras, agora usando is_admin()
CREATE POLICY "Usuario ve o proprio perfil; admin ve todos" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admin gerencia perfis" ON public.profiles
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Equipe logada ve revendas" ON public.revendas
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin gerencia revendas" ON public.revendas
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Equipe logada ve progresso" ON public.progresso
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Gestor atualiza progresso das suas revendas" ON public.progresso
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.revendas r WHERE r.id = progresso.revenda_id AND r.gestor_responsavel_id = auth.uid())
  );
CREATE POLICY "Gestor registra progresso das suas revendas" ON public.progresso
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.revendas r WHERE r.id = progresso.revenda_id AND r.gestor_responsavel_id = auth.uid())
  );
CREATE POLICY "Admin gerencia progresso" ON public.progresso
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------
-- PARTE 2 · Atualiza a coluna updated_at automaticamente
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------
-- PARTE 3 · Tabelas novas
-- ---------------------------------------------------------------------

-- Implantações (quadro CRM + formulário Nova Revenda)
CREATE TABLE IF NOT EXISTS public.implantacoes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo           text,
  revenda          text NOT NULL,
  cnpj             text,
  cidade           text,
  uf               text,
  email            text,
  telefone         text,
  contato          text,
  cargo            text,
  situacao         text,
  segmento         text,
  porte            text,
  vendedores       integer CHECK (vendedores >= 0),
  data_ingresso    date,
  data_aniversario date,
  contratos        integer CHECK (contratos >= 0),
  curva            text,
  etapa            text NOT NULL DEFAULT 'chegada',
  prioridade       text NOT NULL DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente')),
  produto          text,
  responsavel      text,
  data_prevista    date,
  observacoes      text,
  status           text NOT NULL DEFAULT 'em-andamento' CHECK (status IN ('em-andamento', 'concluida', 'pausado', 'abandonado')),
  etapa_desde      timestamptz NOT NULL DEFAULT now(),
  created_by       uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_implantacoes_etapa ON public.implantacoes(etapa);

-- Lives (aba Lives e Agenda)
CREATE TABLE IF NOT EXISTS public.jornada_lives (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tema         text NOT NULL,
  data         date NOT NULL,
  hora         text NOT NULL CHECK (hora ~ '^\d{2}:\d{2}$'),
  duracao      integer CHECK (duracao >= 0),
  apresentador text,
  modulo       text,
  link         text,
  descricao    text,
  status       text NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada', 'realizada', 'cancelada')),
  created_by   uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_jornada_lives_data ON public.jornada_lives(data);

-- Treinamentos agendados (aba Agenda)
CREATE TABLE IF NOT EXISTS public.jornada_sessoes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo      text NOT NULL,
  dia         integer NOT NULL,
  titulo      text NOT NULL,
  data        date NOT NULL,
  hora        text NOT NULL CHECK (hora ~ '^\d{2}:\d{2}$'),
  duracao     integer CHECK (duracao >= 0),
  revenda     text,
  instrutor   text,
  link        text,
  observacoes text,
  status      text NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'realizado', 'cancelado')),
  created_by  uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_jornada_sessoes_data ON public.jornada_sessoes(data);

-- Treinamentos adicionados pelo botão "+ Novo treinamento"
CREATE TABLE IF NOT EXISTS public.jornada_treinamentos_custom (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo     text NOT NULL,
  dia        integer NOT NULL,
  title      text NOT NULL,
  obj        text,
  temas      text[] NOT NULL DEFAULT '{}',
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (modulo, dia)
);

-- Temas marcados como concluídos na Jornada (ex.: "lcweb-day1-tema0")
CREATE TABLE IF NOT EXISTS public.jornada_progresso (
  tema_key   text PRIMARY KEY,
  updated_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- PARTE 4 · updated_at automático + segurança (só usuários logados)
-- ---------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['implantacoes', 'jornada_lives', 'jornada_sessoes', 'jornada_treinamentos_custom', 'jornada_progresso']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON public.%I', t, t);
    EXECUTE format('CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t, t);

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "Equipe logada acessa" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Equipe logada acessa" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;
