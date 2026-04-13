-- Criar tabela de projetos
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech TEXT[],
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de contatos
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (opcional, mas recomendado)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para leitura
CREATE POLICY "允许公开读取项目" ON projects FOR SELECT USING (true);
CREATE POLICY "允许公开读取联系信息" ON contacts FOR SELECT USING (true);

-- Políticas de acesso para inserção (público para contacts)
CREATE POLICY "允许公开插入联系信息" ON contacts FOR INSERT WITH CHECK (true);

-- Políticas para projetos (apenas autenticados podem criar/editar/deletar)
CREATE POLICY "允许认证用户创建项目" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "允许认证用户更新项目" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "允许认证用户删除项目" ON projects FOR DELETE USING (auth.role() = 'authenticated');
