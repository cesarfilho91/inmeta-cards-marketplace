# 🃏 Card Marketplace - Frontend

Aplicação SPA desenvolvida com **Vue 3 + TypeScript + Vite**, estruturada com arquitetura baseada em módulos (feature-based architecture), focada em escalabilidade, organização e separação clara de responsabilidades.

---

# 📐 Visão Técnica da Arquitetura

O projeto segue uma abordagem **Domain / Feature First**, onde cada domínio da aplicação é isolado dentro da pasta `modules/`.

## Estrutura Geral

```
src/
 ├── api/              # Configuração central do Axios
 ├── assets/           # Estilos globais e imagens
 ├── components/       # Componentes globais reutilizáveis
 ├── composables/      # Composables globais
 ├── layouts/          # Layouts estruturais da aplicação
 ├── modules/          # Módulos por domínio (feature-based)
 ├── router/           # Configuração e tipagem de rotas
 ├── shared/           # Componentes e utilitários compartilhados
 ├── stores/           # Stores globais
 ├── App.vue
 └── main.ts
```

---

# 🧩 Arquitetura Baseada em Módulos

Cada módulo contém:

```
modules/
  nome-do-modulo/
    components/
    services/
    store/
    views/
    types.ts
```

### Separação de responsabilidades

* **components/** → Componentes visuais específicos do domínio
* **services/** → Comunicação com API (camada de dados)
* **store/** → Gerenciamento de estado com Pinia
* **views/** → Telas vinculadas às rotas
* **types.ts** → Tipagem centralizada do domínio

Essa abordagem permite:

* Escalabilidade horizontal
* Baixo acoplamento
* Fácil manutenção
* Clareza organizacional

---

# 🏗 Layouts

A aplicação utiliza dois layouts principais:

* `AppLayout` → Área autenticada
* `PublicLayout` → Área pública (login/registro)

As views são renderizadas via `<RouterView />` dentro de `<Transition>` para animações controladas.

---

# 🌐 Comunicação com API

* Axios centralizado em `api/axios.ts`
* Services isolam regras de comunicação
* Tratamento de erros centralizado via `errorMapper`

Essa separação evita acoplamento entre camada visual e camada de dados.

---

# 🗂 Gerenciamento de Estado

* **Pinia** para gerenciamento de estado
* Stores locais dentro dos módulos
* Stores globais em `/stores`

Exemplo:

* `auth.store.ts` → estado de autenticação
* `marketplace.store.ts` → estado do marketplace
* `toast.store.ts` → estado global de notificações

---

# 🎨 Estilização

* CSS modularizado por domínio
* Variáveis globais em `variables.css`
* Separação entre estilos de layout e estilos de feature

---

# 🚀 Scripts

```
npm install
npm run dev
npm run build
npm run preview
```

---

# 📦 Padrão de Commits

O projeto segue o padrão **Conventional Commits**:

* `feat:` nova funcionalidade
* `fix:` correção de bug
* `refactor:` melhoria estrutural
* `chore:` tarefas internas
* `docs:` documentação

---

# 🔮 Direcionamento Futuro

* Implementação de testes unitários (Vitest)
* Testes E2E (Cypress ou Playwright)
* Lazy loading de módulos
* Code splitting por rota
* Pipeline CI/CD automatizado

---

# 📌 Objetivo do Projeto

Construir uma aplicação organizada, escalável e preparada para crescimento, mantendo padrões de mercado e boas práticas de arquitetura frontend moderna.

---

Desenvolvido com foco em qualidade estrutural e visão técnica de longo prazo.
