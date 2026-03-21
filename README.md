# 💬 LinkZap — Gerenciador de Grupos WhatsApp

Sistema para criar links de redirecionamento para grupos do WhatsApp com painel admin, autenticação e contador de cliques.

---

## 🗄️ 1. Configurar Supabase

Execute no **SQL Editor** do Supabase:

```sql
-- Tabela de grupos
create table groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  whatsapp_url text not null,
  slug text unique not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- Tabela de cliques
create table clicks (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade,
  clicked_at timestamptz default now()
);

-- View com contagem de cliques
create view groups_with_clicks as
  select g.*, count(c.id)::int as click_count
  from groups g
  left join clicks c on c.group_id = g.id
  group by g.id;

-- Segurança (RLS)
alter table groups enable row level security;
alter table clicks enable row level security;

create policy "public read active groups" on groups for select using (true);
create policy "public insert clicks" on clicks for insert with check (true);
create policy "authenticated manage groups" on groups for all using (auth.role() = 'authenticated');
create policy "authenticated delete groups" on groups for delete using (auth.role() = 'authenticated');
```

---

## 👤 2. Criar usuário admin

No Supabase → **Authentication → Users → Add User**:
- Coloque seu e-mail e senha
- Esse será o login do painel

---

## 🔑 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz (não commitar):

```
REACT_APP_SUPABASE_URL=https://rzpxfwgmkxcvabtfuzfm.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

---

## 🚀 4. Deploy na Vercel

### Opção A — Via GitHub (recomendado):
1. Suba o projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) → **New Project**
3. Importe o repositório
4. Em **Environment Variables**, adicione:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. Clique em **Deploy**

### Opção B — Via CLI:
```bash
npm install -g vercel
vercel --prod
```

---

## 🧪 5. Rodar localmente

```bash
npm install
npm start
```

---

## 📍 Rotas

| Rota | Descrição |
|------|-----------|
| `/login` | Login do admin |
| `/admin` | Painel de gerenciamento (protegido) |
| `/g/:slug` | Página de redirecionamento pública |

---

## ✅ Funcionalidades

- 🔐 Login/senha via Supabase Auth
- ➕ Cadastrar grupos com link único gerado automaticamente
- ⏸ Ativar/Pausar grupos sem deletar
- 🔗 Copiar link gerado para usar no anúncio
- 📊 Contador de cliques por grupo em tempo real
- 🚫 Página de "grupo indisponível" quando pausado
- 🔍 Página 404 para links inválidos
# linkzap
# linkzap
# linkzap
# linkzap
# linkzap
# linkzap
# linkzap
