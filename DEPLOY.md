# Guia de Implantação: Supabase & Render 🚀

Este guia explica como configurar o banco de dados no **Supabase** e como publicar o **Cultiva App** gratuitamente no **Render**.

---

## Parte 1: Configurando o Supabase 🗄️

O **Supabase** fornecerá o banco de dados PostgreSQL na nuvem para armazenar todas as informações do aplicativo.

1. **Criar uma conta e projeto:**
   - Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
   - Crie um novo projeto com o nome `Cultiva`.
   - Defina uma senha forte para o banco de dados e selecione uma região próxima (ex: `South America (São Paulo) - sa-east-1`).

2. **Criar as tabelas e dados iniciais:**
   - No painel lateral esquerdo do Supabase, clique em **SQL Editor**.
   - Clique em **New query** (Nova consulta).
   - Abra o arquivo [supabase_schema.sql](file:///d:/ester_projetos/supabase_schema.sql) localizado na raiz deste projeto, copie todo o seu conteúdo e cole no editor do Supabase.
   - Clique no botão **Run** (Executar) no canto inferior direito.
   - Verifique na aba **Table Editor** se as tabelas `turmas`, `users`, `plants`, `posts` e `feedback` foram criadas com sucesso e populadas com os dados iniciais.

3. **Obter as chaves de API:**
   - Acesse **Project Settings** (ícone de engrenagem no painel lateral) -> **API**.
   - Copie a **Project URL** (ex: `https://xxxxxx.supabase.co`).
   - Copie a **API Key anon public** (chave anônima pública).

4. **Configuração local (.env):**
   - No seu projeto local, abra o arquivo `.env` na raiz.
   - Cole os valores copiados:
     ```env
     VITE_SUPABASE_URL=https://sua-url-do-supabase.supabase.co
     VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
     ```

---

## Parte 2: Implantando no Render (Site Estático) 🌐

O **Render** hospedará o frontend React do Cultiva de forma gratuita.

### Método A: Usando o Blueprint (Mais Rápido)
1. Certifique-se de que o seu código com os novos arquivos (`render.yaml`, `supabaseClient.js`, etc.) esteja no seu repositório do GitHub (privado ou público).
2. Acesse o painel do [Render](https://dashboard.render.com).
3. Clique em **New +** e selecione **Blueprint**.
4. Conecte o repositório do seu projeto.
5. O Render detectará automaticamente o arquivo `render.yaml` e solicitará as variáveis de ambiente:
   - `VITE_SUPABASE_URL` (Sua URL do Supabase)
   - `VITE_SUPABASE_ANON_KEY` (Sua chave Anon do Supabase)
6. Clique em **Apply** e o Render fará o build e deploy automaticamente!

### Método B: Configuração Manual
Se preferir configurar manualmente na interface do Render:
1. Clique em **New +** -> **Static Site**.
2. Conecte o repositório do GitHub.
3. Insira as seguintes configurações:
   - **Name:** `cultiva-app`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Expanda a seção **Environment Variables** (Variáveis de Ambiente) e adicione:
   - `VITE_SUPABASE_URL` ➔ `[Sua URL do Supabase]`
   - `VITE_SUPABASE_ANON_KEY` ➔ `[Sua chave Anon]`
5. Clique em **Create Static Site**.
6. Após alguns minutos de build, o Render fornecerá uma URL pública do tipo `https://cultiva-app.onrender.com`.

---

Pronto! Seu aplicativo agora está conectado a um banco de dados real na nuvem e disponível na web para seus alunos usarem. 🎉
