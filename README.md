
Nome Cleidy Camila Zegarrundo Mamani— RM 557158

Tecnologias

Vite + React + TypeScript

React Router DOM

React Hook Form (RHF)

(Opcional) Zod + @hookform/resolvers para validação

TailwindCSS

json-server (API fake)

concurrently (rodar front + API juntos)


src/
  
  routes/
    Home/              # Login (página inicial) ou Dashboard pós-login
      index.tsx
    Cadastro/
      index.tsx        # formulário de cadastro
    Error/
      index.tsx        # página 404/erros
  services/
    api.ts             # funções de acesso ao json-server (/usuarios)
  App.tsx              # layout base com <Outlet />
  main.tsx             # definição das rotas
  globals.css          # estilos globais (Tailwind directives)
db.json                # base da API fake (endpoint /usuarios)


Rotas

/login → Página inicial (formulário com nomeUsuario e email)

/cadastro → Formulário com nome, nomeUsuario, email

/dashboard (opcional) → Página pós-login (mostra nome e email)

* → 404 (Error)