-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles (users with roles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'gestor')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin');

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Table: trilhas (training tracks: LC WEB, LC ERP Desktop, Produtos)
CREATE TABLE trilhas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE trilhas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view trilhas"
  ON trilhas FOR SELECT
  USING (true);

-- Table: dias (days within each track)
CREATE TABLE dias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trilha_id UUID NOT NULL REFERENCES trilhas(id) ON DELETE CASCADE,
  numero INT NOT NULL,
  titulo TEXT NOT NULL,
  objetivo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(trilha_id, numero)
);

ALTER TABLE dias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view dias"
  ON dias FOR SELECT
  USING (true);

-- Table: temas (topics/screens within each day)
CREATE TABLE temas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dia_id UUID NOT NULL REFERENCES dias(id) ON DELETE CASCADE,
  nome_tela TEXT NOT NULL,
  acessos INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE temas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view temas"
  ON temas FOR SELECT
  USING (true);

-- Table: revendas (resellers/clients)
CREATE TABLE revendas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'pausada', 'concluida')),
  trilha_id UUID NOT NULL REFERENCES trilhas(id) ON DELETE RESTRICT,
  gestor_responsavel_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  data_inicio DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE revendas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view revendas"
  ON revendas FOR SELECT
  USING (true);

CREATE POLICY "Gestores can view assigned revendas"
  ON revendas FOR SELECT
  USING (
    gestor_responsavel_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can manage all revendas"
  ON revendas FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Table: progresso (training progress for each reseller x topic)
CREATE TABLE progresso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  revenda_id UUID NOT NULL REFERENCES revendas(id) ON DELETE CASCADE,
  tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
  concluido BOOLEAN DEFAULT FALSE,
  concluido_em TIMESTAMP,
  concluido_por UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(revenda_id, tema_id)
);

ALTER TABLE progresso ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view progresso"
  ON progresso FOR SELECT
  USING (true);

CREATE POLICY "Gestores can update progresso for assigned revendas"
  ON progresso FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM revendas
      WHERE revendas.id = progresso.revenda_id
      AND revendas.gestor_responsavel_id = auth.uid()
    ) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM revendas
      WHERE revendas.id = progresso.revenda_id
      AND revendas.gestor_responsavel_id = auth.uid()
    ) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Gestores can insert progresso for assigned revendas"
  ON progresso FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM revendas
      WHERE revendas.id = progresso.revenda_id
      AND revendas.gestor_responsavel_id = auth.uid()
    ) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can manage all progresso"
  ON progresso FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Indexes for performance
CREATE INDEX idx_dias_trilha_id ON dias(trilha_id);
CREATE INDEX idx_temas_dia_id ON temas(dia_id);
CREATE INDEX idx_revendas_trilha_id ON revendas(trilha_id);
CREATE INDEX idx_revendas_gestor_id ON revendas(gestor_responsavel_id);
CREATE INDEX idx_progresso_revenda_id ON progresso(revenda_id);
CREATE INDEX idx_progresso_tema_id ON progresso(tema_id);
CREATE INDEX idx_progresso_revenda_tema ON progresso(revenda_id, tema_id);
