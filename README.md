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
| `/usuarios` | Administrador | Listagem integrada ao backend |
| `/usuarios/novo` | Administrador | Cadastro integrado ao backend |
| `/clientes` | Administrador e Operador | Listagem e cadastro integrados ao backend |
| `/produtos` | Administrador e Operador | Listagem e cadastro integrados ao backend |
| `/pedidos` | Administrador e Operador | Listagem com filtros (RF06) |
| `/pedidos/novo` | Administrador e Operador | Criação de pedido (RF04) |
| `/pedidos/:id` | Administrador e Operador | Detalhe, linha do tempo, avanço e cancelamento (RF05, RF07) |
| `/pedidos/:id/editar` | Administrador e Operador | Edição antes do despacho (RF05) |
| Outras URLs | Exigem sessão | Página não encontrada com retorno ao início |

`ProtectedRoute` centraliza a exigência de sessão e a restrição por perfil. `AppLayout` concentra o menu, a identificação e o logout. Os perfis permitidos para usuários são compartilhados entre a configuração da rota e do menu.
`SessionObserver` agenda o encerramento para o horário `exp` do JWT, mesmo sem chamadas à API, e revalida a sessão ao retornar à aba/janela. Login, troca de usuário e logout são sincronizados entre abas pela alteração de `localStorage`.

- Token expirado/inválido: limpar a sessão e abrir `/login` com uma mensagem.
- `401` de uma requisição autenticada da sessão atual: mesmo encerramento com aviso. Erro de credenciais no login é tratado pelo formulário.
- `403`: informar falta de permissão e manter a sessão. O Operador acessando `/usuarios` pela URL recebe uma página de acesso negado.
- Respostas atrasadas de uma sessão anterior não encerram uma sessão nova; login cancelado por logout não restaura o acesso.
- Logout remove o token local. Não existe endpoint de revogação imediata; o backend continua validando assinatura, expiração e permissões em cada requisição.

### Verificação da etapa 2

1. Sem sessão, abrir `/` e `/usuarios`: ambos devem direcionar para `/login`.
2. Entrar como Administrador: conferir menu, nome/perfil e acesso à listagem de usuários. Atualizar `/usuarios` deve preservar o acesso.
3. Entrar como Operador: a opção Usuários deve ficar oculta; digitar `/usuarios` deve mostrar “Acesso negado”, mantendo a sessão.
4. Abrir duas abas autenticadas e sair em uma: ambas devem voltar ao login. Um novo login deve atualizar o perfil nas duas.
5. Para testar expiração em ambiente local, iniciar o backend com `JWT_EXPIRATION=PT30S`, fazer novo login e aguardar. A aplicação deve voltar ao login com aviso mesmo sem interação. Restaurar a configuração depois do teste.
6. Conferir o menu em celular, o acesso por teclado e o retorno ao início em URL inexistente.

O aceite da interface não substitui os testes de autorização da API. As chamadas internas devem usar a instância `api` de `services/api.ts` para receber os tratamentos de `401` e `403`.

## Cadastro e listagem de usuários

A listagem usa `GET /api/usuarios` e exibe nome, e-mail e perfil, na ordem recebida do backend (nome e id). Há estados de carregamento, lista vazia e erro com opção de tentar novamente, além do botão Atualizar lista. Senhas e hashes não são exibidos.

Novo usuário abre `/usuarios/novo`, cujo formulário envia `POST /api/usuarios` com `nome`, `email`, `senha` e `perfil`. Somente Administrador pode acessar as duas telas; a API também exige esse perfil.

- Nome obrigatório, até 120 caracteres; e-mail obrigatório, válido e até 254 caracteres. Espaços externos são removidos; e-mail é enviado em minúsculas.
- Senha inicial obrigatória e limitada a 72 bytes UTF-8, preservando seu conteúdo. Não há tamanho mínimo adicional ao requisito. A senha fica apenas no estado do formulário e não é gravada em armazenamento local.
- Perfil obrigatório, selecionado entre Administrador e Operador.
- Durante o envio, o formulário e os botões ficam desabilitados. Não há reenvio automático de POST.
- `400` associa os erros de `detalhes` aos respectivos campos; `409 / EMAIL_JA_CADASTRADO` destaca o e-mail; outros conflitos aparecem como erro geral.
- Falha de rede/timeout pode ocorrer após o servidor persistir o cadastro: a tela orienta conferir a lista antes de repetir.
- Após sucesso, aparece confirmação, a aplicação retorna à lista e busca os dados novamente. Se essa consulta falhar, é possível repeti-la sem reenviar o cadastro.
- Ao sair da página ou trocar de sessão, requisições pendentes são canceladas no cliente e os estados são descartados. Cancelamento de requisição não desfaz uma gravação que já tenha ocorrido no servidor.

### Verificação das etapas 3 e 4

1. Entrar como Administrador e abrir Usuários: conferir os registros existentes e Atualizar lista.
2. Usar Novo usuário e enviar o formulário vazio: verificar as mensagens de obrigatoriedade.
3. Cadastrar um Operador com dados fictícios: conferir a confirmação e seu aparecimento na lista, inclusive após atualizar a página.
4. Repetir o e-mail alterando caixa ou espaços externos: verificar a mensagem de duplicidade sem perder os dados preenchidos.
5. Cadastrar outro Administrador com e-mail diferente e conferir o perfil exibido.
6. Sair e entrar com o Operador recém-criado: login deve funcionar, mas `/usuarios` e `/usuarios/novo` devem mostrar Acesso negado.
7. Entrar com o Administrador recém-criado: ele deve conseguir listar e cadastrar usuários.

Edição e exclusão de usuários não fazem parte deste escopo.

## Cadastro e listagem de clientes e produtos

A tela “Clientes e Produtos” tem duas abas com endereço próprio, `/clientes` e `/produtos`, também acessíveis pelo menu. Cada aba mostra a lista ao lado do formulário de novo registro (empilhados em telas menores). Administrador e Operador têm acesso, como na API.

| Aba | Lista | Formulário |
|---|---|---|
| Clientes | `GET /api/clientes`: nome, telefone e endereço | `POST /api/clientes` com `nome`, `telefone` e `endereco` |
| Produtos | `GET /api/produtos`: código, nome e estoque mínimo | `POST /api/produtos` com `codigo`, `nome` e `estoqueMinimo` |

- A lista segue a ordem do backend (nome e id) e tem estados de carregamento, lista vazia e erro com nova tentativa.
- Todos os campos são obrigatórios, com os limites da API: nome até 120 caracteres; telefone até 30; endereço até 500; código até 64. Espaços externos são removidos.
- O telefone mantém a formatação digitada, mas precisa ter só dígitos, espaços, `( ) + - .` e ao menos 8 dígitos. Essa regra existe só no front-end.
- O código é enviado em maiúsculas. Código repetido (`409 / CODIGO_PRODUTO_JA_CADASTRADO`) é indicado no próprio campo.
- O estoque mínimo aceita apenas inteiros de 0 a 2.147.483.647.
- `400` associa os `detalhes` aos campos; quando todos os erros aparecem nos campos, não se repete a mensagem geral.
- Após salvar: aviso de sucesso, formulário limpo com foco no primeiro campo e lista atualizada. Se a atualização falhar, os dados anteriores continuam visíveis com a opção de tentar novamente.
- “Cancelar” limpa o formulário. Durante o envio, campos e botões ficam desabilitados e não há reenvio automático. Falha de rede pode ocorrer após a gravação; a tela orienta conferir a lista antes de repetir.

A API não tem edição nem exclusão de clientes e produtos, então a tela não oferece essas ações.

### Verificação da etapa 5

1. Entrar como Operador e abrir Clientes pelo menu: conferir os registros e a aba ativa. Repetir com Administrador.
2. Enviar o formulário vazio: verificar as mensagens de obrigatoriedade. Informar telefone `abc`: verificar a mensagem de telefone inválido.
3. Cadastrar um cliente fictício: conferir o aviso, o formulário limpo e o cliente na lista, inclusive após atualizar a página.
4. Abrir a aba Produtos e cadastrar `PROD-900`. Repetir com ` prod-900 `: o campo Código deve indicar duplicidade sem perder os dados preenchidos.
5. Informar estoque `-1` ou `1,5`: verificar a mensagem de número inteiro.
6. Conferir as duas abas em celular e por teclado.

## Listagem de pedidos

`/pedidos` lista os pedidos com código de consulta (RN06), cliente, status e prazo de entrega, como pede o RF06, do mais recente para o mais antigo (maior id primeiro). Pedidos atrasados recebem o selo “Atrasado”, linha destacada e prazo em vermelho. As cores dos status vêm de `theme.status`.

- Filtros de status (incluindo “Atrasado”) e cliente, combináveis e aplicados sobre a lista carregada. As opções de cliente são os clientes que aparecem nos pedidos.
- Os filtros ficam na URL (`/pedidos?status=EM_TRANSITO&cliente=1`), preservados ao atualizar ou compartilhar o endereço. Valores desconhecidos são ignorados.
- O rodapé informa a quantidade (`2 de 7 pedidos` com filtros). Sem resultados, a tela oferece limpar os filtros.
- Estados de carregamento, lista vazia e erro com nova tentativa, como nas demais listagens.
- “Novo pedido” abre o formulário de criação; “Ver detalhes” abre o pedido.

**Contrato usado pela tela.** `GET /api/pedidos`, para Administrador e Operador, devolve `200` com um array:

```json
[{"id":1044,"codigo":"K7QM2XPA","cliente":{"id":1,"nome":"Comercial Silva Ltda"},"status":"EM_TRANSITO","prazoEntrega":"2026-10-21","atrasado":true}]
```

- `codigo`: código de consulta gerado na criação do pedido (RN06), exibido na primeira coluna. O `id` identifica o pedido nas chamadas à API e define a ordem.

- `status`: `CRIADO`, `EM_SEPARACAO`, `DESPACHADO`, `EM_TRANSITO`, `ENTREGUE` ou `CANCELADO`.
- `prazoEntrega`: data sem horário (`AAAA-MM-DD`), exibida como `21/10/2026`.
- `atrasado`: calculado pelo backend (prazo vencido sem entrega nem cancelamento), para que a regra seja a mesma em listagens, acompanhamento e relatórios.

## Criação, edição e detalhe de pedidos

**Novo pedido (`/pedidos/novo`, RF04)** e **edição (`/pedidos/:id/editar`, RF05)** usam o mesmo formulário: cliente, prazo de entrega, endereço de entrega e itens (produto e quantidade). Enviam `POST /api/pedidos` ou `PUT /api/pedidos/{id}`:

```json
{"clienteId":1,"enderecoEntrega":"Rua das Flores, 120 – Sorocaba/SP","prazoEntrega":"2026-11-20","itens":[{"produtoId":1,"quantidade":20}]}
```

- Clientes e produtos vêm de `GET /api/clientes` e `GET /api/produtos`. Sem cadastros, a tela orienta a cadastrar antes.
- Ao escolher o cliente, o endereço de entrega é preenchido com o endereço dele. Um endereço digitado pelo usuário é mantido.
- Todos os campos são obrigatórios. O prazo não pode ser anterior a hoje (calendário de São Paulo, como na API); na edição, um prazo já vencido pode ser mantido.
- Itens: ao menos um, quantidade inteira maior que zero (RN08) e sem produto repetido. “Remover” fica indisponível no último item.
- Erros da API (`400` com `detalhes`, inclusive `itens[1].quantidade`) aparecem no campo correspondente; conflitos (`409`) aparecem no topo do formulário.
- Após salvar, a tela abre o detalhe do pedido. A criação informa o código de consulta.
- A edição só é oferecida em Criado ou Em separação (RN02); fora desses status, a página informa que o pedido não pode mais ser editado.

**Detalhe (`/pedidos/:id`)** usa `GET /api/pedidos/{id}` e mostra status (com “Atrasado” quando for o caso), cliente, prazo, endereço, código de consulta, itens e a linha do tempo (RF07/RF13): cada etapa concluída com data, hora e usuário, a próxima etapa e as pendentes. Um pedido cancelado mostra só as etapas que ocorreram.

- “Avançar para …” (`POST /api/pedidos/{id}/avancar` com `{"statusAtual": …}`) leva à próxima etapa (RN01). Se o pedido já tiver mudado (clique duplo ou outra pessoa), a API recusa com `409`, a tela avisa e recarrega o pedido.
- “Editar” e “Cancelar pedido” aparecem só em Criado ou Em separação. O cancelamento pede confirmação (`POST /api/pedidos/{id}/cancelar`) e é final.
- Ids inválidos ou inexistentes mostram “Pedido não encontrado”, com retorno à lista.
- A baixa de estoque no despacho (RF09/RN03) é da Release 2; a linha do tempo ainda não a menciona.

### Verificação da etapa 6

1. Entrar como Operador e abrir Pedidos pelo menu: conferir o código de consulta de cada pedido, a ordem (mais recentes primeiro), os selos e o rodapé. Repetir com Administrador.
2. Conferir que um pedido com prazo vencido e não entregue aparece destacado, com o selo “Atrasado”.
3. Filtrar por status, depois por cliente: a lista e o rodapé (`N de M pedidos`) devem refletir os dois filtros. Atualizar a página deve manter os filtros.
4. Escolher uma combinação sem resultados: deve aparecer “Nenhum pedido encontrado” com a opção de limpar os filtros.
5. Usar “Novo pedido” e enviar vazio: verificar as mensagens. Escolher um cliente e conferir o endereço preenchido.
6. Informar prazo de ontem, o mesmo produto em dois itens e quantidade `1,5`: cada campo deve indicar o erro.
7. Criar o pedido: a tela deve abrir o detalhe com status Criado, o código de consulta e a linha do tempo com data, hora e usuário.
8. Avançar até Entregue, uma etapa por vez: cada etapa entra na linha do tempo; “Editar” e “Cancelar pedido” somem a partir de Despachado.
9. Em outro pedido, editar em Em separação (alterar quantidade, remover um item) e depois cancelar, confirmando no diálogo.
10. Abrir o mesmo pedido em duas abas, avançar em uma e tentar avançar na outra: deve aparecer o aviso e o status atualizado.
11. Conferir as telas em celular e por teclado.

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

Para subir frontend, backend e PostgreSQL juntos, mantenha os dois repositórios em pastas irmãs e execute `docker compose up -d --build` na pasta do backend, após preencher o `.env` conforme seu README. O frontend fica em `http://localhost:3000`, com `/api` encaminhado ao backend. O Compose completo já está no repositório do backend; não é preciso copiar o exemplo abaixo para usá-lo.

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

## Entrada de estoque — RF08

A rota protegida `/estoque/entradas`, disponível no menu para Administrador e Operador, carrega produtos de `GET /api/produtos` e registra entradas por `POST /api/estoque/entradas`. Selecione produto, quantidade inteira positiva e data. Após salvar, a tela confirma a entrada, o responsável e o saldo após aquela operação.

Os campos são desabilitados durante o envio e não há repetição automática do POST. Erros de validação aparecem nos campos; em falha de conexão, confirme se o registro ocorreu antes de tentar novamente. O resumo mostra somente a última entrada registrada nesta tela e não substitui a futura consulta de saldos/histórico.

Para validar: cadastre um produto, abra Entrada de estoque, registre 10 unidades e depois 5; confira saldos 10 e 15. Repita com Operador. Verifique campos obrigatórios e rejeição de quantidade zero, negativa ou fracionada. Sem produtos cadastrados, a tela oferece acesso ao cadastro. A API precisa estar atualizada com a migração V5.
