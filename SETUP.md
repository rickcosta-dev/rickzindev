# Setup Supabase

## 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Anote as credenciais:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJxxxxx...`

## 2. Configurar Variáveis de Ambiente

No arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

## 3. Criar Tabelas

Execute o SQL abaixo no **SQL Editor** do Supabase:

```sql
-- Tabela de projetos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech TEXT[],
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contatos
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. (Opcional) Row Level Security

Se quiser proteger o banco:

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Projetos: leitura pública, escrita apenas autenticado
CREATE POLICY "public_read_projects" ON projects FOR SELECT USING (true);
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Contatos: todos podem enviar, apenas autenticados podem ler
CREATE POLICY "public_insert_contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_contacts" ON contacts FOR SELECT USING (auth.role() = 'authenticated');
```

## 5. Criar Usuário Admin

No Supabase, vá em **Authentication > Users** e crie um usuário ou invite um email.

## 6. Testar

Execute `npm run dev` e verifique se os dados carregam corretamente.
