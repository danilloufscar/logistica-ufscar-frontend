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

No PowerShell, o comando para copiar a configuração é `Copy-Item .env.example .env`.

## Login integrado

A tela `/login` usa `POST /api/auth/login` com `{ email, senha }` e recebe `{ token }`.
Antes de testar, inicie o PostgreSQL e o backend, usando as instruções do repositório do backend.
Use um usuário já cadastrado; não há credenciais fixas no frontend.

- Campos obrigatórios e formato de e-mail são validados antes do envio. A senha é enviada sem remover seus espaços.
- Durante a requisição, o formulário fica desabilitado e o botão mostra “Entrando…”.
- A tela mostra erros de credenciais, conexão e indisponibilidade do servidor, permitindo tentar novamente.
- O token retornado é armazenado em `localStorage` (`sglu.token`); a senha não é armazenada.
- Após autenticar, `/` apresenta a área interna com menu, nome, perfil e botão Sair. O menu adapta-se a telas pequenas.
- Ao abrir a aplicação, tokens expirados ou com dados obrigatórios inválidos são descartados. A validação da assinatura e das permissões continua sendo responsabilidade do backend.
- Uma nova tentativa de login não envia um token antigo no cabeçalho Authorization.

### Roteiro de verificação

1. Acesse `/`: sem sessão, a aplicação deve abrir `/login`.
2. Envie campos vazios e um e-mail inválido: as mensagens devem aparecer junto aos campos.
3. Entre com uma senha incorreta: deve aparecer “E-mail ou senha incorretos”.
4. Entre com credenciais válidas de Administrador ou Operador: a página inicial deve mostrar o nome e o perfil.
5. Atualize a página: uma sessão válida deve ser preservada. Use Sair: a sessão deve ser removida e a tela de login reapresentada.
6. Confira o formulário em celular e a navegação por teclado, incluindo mostrar/ocultar senha.

## Área interna e controle de acesso

| Rota | Acesso | Estado |
|---|---|---|
| `/login` | Público; sessão válida direciona ao início | Login integrado |
| `/` | Administrador e Operador | Início e navegação |
| `/usuarios` | Administrador | Área reservada; listagem e cadastro serão implementados nas próximas etapas |
| Outras URLs | Exigem sessão | Página não encontrada com retorno ao início |

`ProtectedRoute` centraliza a exigência de sessão e a restrição por perfil. `AppLayout` concentra o menu, a identificação e o logout. Os perfis permitidos para usuários são compartilhados entre a configuração da rota e do menu. Clientes, produtos e pedidos aparecem como “Em breve”, sem navegação ativa.

`SessionObserver` agenda o encerramento para o horário `exp` do JWT, mesmo sem chamadas à API, e revalida a sessão ao retornar à aba/janela. Login, troca de usuário e logout são sincronizados entre abas pela alteração de `localStorage`.

- Token expirado/inválido: limpar a sessão e abrir `/login` com uma mensagem.
- `401` de uma requisição autenticada da sessão atual: mesmo encerramento com aviso. Erro de credenciais no login é tratado pelo formulário.
- `403`: informar falta de permissão e manter a sessão. O Operador acessando `/usuarios` pela URL recebe uma página de acesso negado.
- Respostas atrasadas de uma sessão anterior não encerram uma sessão nova; login cancelado por logout não restaura o acesso.
- Logout remove o token local. Não existe endpoint de revogação imediata; o backend continua validando assinatura, expiração e permissões em cada requisição.

### Verificação da etapa 2

1. Sem sessão, abrir `/` e `/usuarios`: ambos devem direcionar para `/login`.
2. Entrar como Administrador: conferir menu, nome/perfil e acesso à área reservada de usuários. Atualizar `/usuarios` deve preservar o acesso.
3. Entrar como Operador: a opção Usuários deve ficar oculta; digitar `/usuarios` deve mostrar “Acesso negado”, mantendo a sessão.
4. Abrir duas abas autenticadas e sair em uma: ambas devem voltar ao login. Um novo login deve atualizar o perfil nas duas.
5. Para testar expiração em ambiente local, iniciar o backend com `JWT_EXPIRATION=PT30S`, fazer novo login e aguardar. A aplicação deve voltar ao login com aviso mesmo sem interação. Restaurar a configuração depois do teste.
6. Conferir o menu em celular, o acesso por teclado e o retorno ao início em URL inexistente.

O aceite da interface não substitui os testes de autorização da API. As chamadas internas devem usar a instância `api` de `services/api.ts` para receber os tratamentos de `401` e `403`.

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
- O token JWT deve trazer `sub` (e-mail), `id`, `nome`, `perfil` (`ADMINISTRADOR` ou `OPERADOR`) e `exp`.
- O Axios envia o token em `Authorization: Bearer <token>`, exceto no login. Resposta 401 autenticada encerra a sessão correspondente; 403 informa falta de permissão.

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
