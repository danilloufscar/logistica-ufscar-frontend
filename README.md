# SGLU – Front-end

Front-end do **SGLU (Sistema de Gestão Logística UFSCar)**, projeto da disciplina Gestão de Projetos e Qualidade de Software.

## Tecnologias

- React 18 + TypeScript, com Vite
- React Router (rotas), Redux Toolkit (estado), Axios (API)
- styled-components (estilos), react-hook-form (formulários), react-toastify (avisos), date-fns (datas)

## Como rodar

Pré-requisito: Node 22 (versão em `.nvmrc`).

```bash
npm ci
cp .env.example .env
npm run dev
```

Acesse http://localhost:5173. As chamadas para `/api` são repassadas ao back-end em `http://localhost:8080` (configurável em `API_PROXY_TARGET`).

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos e build de produção em `dist/` |
| `npm run lint` | Lint com oxlint |
| `npm run preview` | Serve o build localmente |

## Estrutura

```
src/
  components/   componentes reutilizáveis
  hooks/        hooks próprios
  layouts/      estruturas de página (menu lateral etc.)
  pages/        uma pasta ou arquivo por tela
  routes/       configuração do React Router
  services/     acesso à API (api.ts = instância do Axios)
  store/        Redux Toolkit (authSlice = sessão do usuário)
  styles/       tema com as cores e fontes do Figma, estilos globais
  types/        tipos TypeScript
  utils/        funções auxiliares
```

Use sempre as cores e fontes de `src/styles/theme.ts` (as mesmas do protótipo no Figma) em vez de valores fixos. Importe arquivos de `src` com o atalho `@/`, por exemplo `import { api } from '@/services/api'`.

## API

- Todas as rotas do back-end ficam sob o prefixo `/api`.
- Login: `POST /api/auth/login` com `{ email, senha }`, que devolve `{ token }`.
- O token JWT deve trazer `sub` (e-mail), `nome`, `perfil` (`ADMINISTRADOR` ou `OPERADOR`) e `exp`.
- O Axios envia o token em `Authorization: Bearer <token>`; uma resposta 401 encerra a sessão.

## Docker

```bash
docker build -t sglu-frontend .
docker run -p 3000:80 -e BACKEND_URL=http://backend:8080 sglu-frontend
```

No `docker-compose.yml` do back-end, o front pode ser construído direto deste repositório, mantendo um único `docker compose up` para subir tudo:

```yaml
  frontend:
    build: https://github.com/danilloufscar/logistica-ufscar-frontend.git#main
    environment:
      BACKEND_URL: http://backend:8080
    ports:
      - "3000:80"
    depends_on:
      - backend
```

## Fluxo de trabalho

- Crie uma branch por issue a partir da `main`, citando o requisito: `feature/RF06-listar-pedidos`.
- Abra um Pull Request; outro integrante revisa antes do merge.
- A CI (GitHub Actions) roda lint, build e build da imagem Docker em cada PR.
- Use apenas dados fictícios.
