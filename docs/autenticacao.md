# Autenticação no app mobile

Documento do fluxo de **login, sessão, expiração, logout e Context API** do `tech-challenge-mobile` (Expo + React Native + TypeScript).

## Visão geral

O usuário informa matrícula e senha. O app chama `POST /api/auth/login/mobile`; o back-end devolve um **token JWT**. O app guarda o token no **SecureStore** (armazenamento seguro do aparelho, chave `authToken`) e o envia em toda requisição no header `Authorization: Bearer <token>`. O usuário logado fica num **contexto React** (`UserContext`), usado pelas telas e pelas rotas.

```
Login (tela)
  └─ signIn(matricula, senha)                 [AuthContext]
       ├─ login()  -> POST /auth/login/mobile [auth.service] -> salva o token no SecureStore
       └─ refreshUser()
            └─ getMe() -> GET /user/me        (token enviado pelo interceptor)
                 └─ setUser(...) -> <Stack.Protected> libera as telas

Logout
  └─ signOut() -> apaga o token, user = undefined -> rotas redirecionam para /login

Sessão expirada
  └─ requisição com token recebe 401 -> interceptor apaga o token e avisa o AuthContext
       -> user = undefined, sessionExpired = true -> /login mostra o aviso
```

## Arquivos (todos em `src/`)

### `services/api.ts`
- Instância do axios com `baseURL = EXPO_PUBLIC_BASE_URL + '/api'`. Exporta também `BASE_URL`, usado nas URLs de imagem.
- **Interceptor de requisição:** lê o token do SecureStore e adiciona `Authorization: Bearer ...`.
- **Interceptor de resposta:**
  - `401` fora do login e do `GET /user/me`, em requisição enviada **com token**: sessão expirada. Apaga o token e chama o handler registrado pelo `AuthContext`.
  - `403`, `404` e `500`: navega para a tela `/error` com o código e a mensagem do back-end.
- Funções de controle: `setUnauthorizedHandler` (registra o que fazer na expiração), `ignoreUnauthorizedResponses` (usada no logout) e `resumeUnauthorizedHandling` (usada no login).

### `services/auth.service.ts`
- `login(matricula, password)`: chama `POST /auth/login/mobile`, valida que veio um token, salva no SecureStore e retorna os dados. Em caso de erro, lança `Error` com mensagem tratada.
- `getBackendErrorMessage(error)`: converte o erro em texto amigável (sem conexão, 400, 401 "Matrícula ou senha inválida", 403, 404/405, 429, 5xx). Evita mostrar HTML ou mensagens técnicas do servidor.

### `context/AuthContext.tsx`
Contexto `UserContext`, provider `UserProvider` e hook `useUser()`.

| Valor | Descrição |
| --- | --- |
| `user` | Usuário logado (`undefined` = ninguém logado) |
| `isLoading` | `true` enquanto verifica se existe sessão ao abrir o app |
| `userImageCacheKey` | Muda ao atualizar a foto, forçando recarregar a imagem |
| `sessionExpired` | `true` quando a sessão acabou por expiração (não por logout) |
| `clearSessionExpired()` | Limpa o aviso depois de exibido |
| `refreshUser()` | Relê o token e busca o usuário (`GET /user/me`) |
| `signIn(matricula, senha)` | Faz login e carrega o usuário. Lança `Error` se falhar |
| `signOut()` | Apaga o token e zera o usuário |

Ao abrir o app, o provider chama `refreshUser()`: sem token, `user` fica `undefined`; com token válido, restaura a sessão; com token vencido (401 no `/user/me`), apaga o token e marca `sessionExpired`.

### `screens/Login/index.tsx` e `styles.ts`
- Campos de matrícula e senha, com botão de ícone (olho) para mostrar/ocultar a senha. O botão tem área de toque ampliada e `accessibilityLabel`.
- Validação de campos vazios, botão desabilitado durante o envio e erros em **toast** (some após 4 segundos).
- Se `sessionExpired` for `true`, mostra o toast "Sua sessão expirou. Faça login novamente." uma única vez.
- Não navega manualmente: quando `user` passa a existir, as rotas protegidas redirecionam.

### `components/Header/index.tsx`
O botão de logout chama `signOut()` e vai para `/login`.

### `navigation/routes.tsx`
`<Stack.Protected guard={!user}>` expõe `/login` só para deslogados. Os demais grupos de rotas exigem `user` e, quando necessário, o perfil (`ADMIN`, `PROFESSOR`, `ALUNO`). Como `signIn`, `signOut` e a expiração mudam `user`, o redirecionamento acontece sozinho.

## Sessão expirada e logout

- **Expiração:** o aviso aparece no login, sem passar pela tela de erro. Vale tanto para o 401 durante o uso quanto para um token vencido ao abrir o app. Requisições sem token não disparam o aviso (nunca houve sessão).
- **Logout:** `signOut()` chama `ignoreUnauthorizedResponses()` antes de apagar o token. Assim, 401 de requisições que ainda estavam em andamento não geram erro nem aviso. O próximo `signIn()` volta ao comportamento normal.
- A tela `/error` fica só para `403`, `404` e `500`.

## Como rodar

1. Back-end atualizado, banco e API rodando, usuário de teste criado.
2. No mobile: `npm install`, copiar `.env.example` para `.env` e definir `EXPO_PUBLIC_BASE_URL`:
   - celular físico: `http://<IP-do-PC>:3000` (mesma rede Wi-Fi)
   - emulador Android: `http://10.0.2.2:3000`
   - navegador (web): `http://localhost:3000`
3. `npx expo start -c` e abrir no **Expo Go** (não pela câmera comum).
4. Se aparecer `Network Error`, libere a porta 3000 no Firewall do Windows.

## Testes manuais

- [ ] Login com usuário válido leva à Home.
- [ ] Senha errada mostra "Matrícula ou senha inválida".
- [ ] O ícone de olho alterna entre mostrar e ocultar a senha.
- [ ] Logout leva ao login, sem aviso e sem tela de erro.
- [ ] Fechar e reabrir o app mantém a sessão.
- [ ] Token vencido ou inválido volta ao login com o aviso "Sua sessão expirou".
- [ ] API desligada mostra "Não foi possível conectar ao servidor".

## Limitações conhecidas

- Não há refresh token: ao expirar, o usuário precisa fazer login de novo.
- O token fica no SecureStore do aparelho; o logout apenas o apaga localmente (o back-end não invalida o JWT).
