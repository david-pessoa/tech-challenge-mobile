# Autenticação no app mobile

Documento da implementação de **login, autenticação por cookie HttpOnly e Context API** no `tech-challenge-mobile` (Expo + React Native + TypeScript).

## Visão geral

O usuário informa matrícula e senha. O app chama `POST /api/auth/login`; o back-end grava o JWT num **cookie HttpOnly** chamado `session` e devolve só os dados públicos do usuário. O app **não lê nem guarda o token**: com `withCredentials: true`, o sistema (Android, iOS ou navegador) armazena o cookie e o envia automaticamente em toda requisição à API. O estado do usuário logado fica num **contexto React** (`UserContext`), consultado pelas telas e pelas rotas.

```
Login (tela)
   └─ signIn(matricula, senha)            [AuthContext]
        ├─ login()  -> POST /auth/login   [auth.service]  -> back-end grava o cookie "session"
        └─ refreshUser()
             └─ getMe() -> GET /user/me   [user.service]  (cookie enviado automaticamente)
                  └─ setUser(...)  -> <Stack.Protected> libera /home

Logout
   └─ signOut() -> POST /auth/logout      -> back-end remove o cookie; user = undefined
```

## Arquivos

Todos em `src/`.

### `services/api.ts`
Instância do axios com `baseURL = EXPO_PUBLIC_BASE_URL + '/api'` e `withCredentials: true`. Exporta também `BASE_URL`, usado para montar a URL das imagens.

### `services/auth.service.ts`
- `login(matricula, password)`: chama `POST /auth/login`. Em caso de erro, lança `Error` com mensagem tratada.
- `logout()`: chama `POST /auth/logout`, que remove o cookie.
- `getBackendErrorMessage(error)`: extrai a mensagem do back-end; devolve "Não foi possível conectar ao servidor." quando a requisição nem chega na API.

### `context/AuthContext.tsx`
Contexto `UserContext` / `UserProvider` / hook `useUser()`.

| Valor | Descrição |
| --- | --- |
| `user` | Usuário logado (`undefined` = ninguém logado) |
| `isLoading` | `true` enquanto verifica se existe sessão ativa |
| `userImageCacheKey` | Muda ao atualizar a foto, forçando recarregar a imagem |
| `refreshUser()` | Busca o usuário de novo (`GET /user/me`) |
| `signIn(matricula, senha)` | Faz login e carrega o usuário. Lança `Error` se falhar |
| `signOut()` | Faz logout na API e zera o usuário |

Ao abrir o app, o provider chama `refreshUser()`: se o cookie de sessão é válido, restaura a sessão; se não há cookie (ou expirou), a API responde 401 e `user` fica `undefined`.

### `screens/Login/index.tsx` e `styles.ts`
Tela de login: matrícula, senha com botão Mostrar/Ocultar, mensagem de erro, botão que desabilita durante o envio e validação de campos vazios. Não navega manualmente: quando `user` passa a existir, o `<Stack.Protected>` redireciona.

### `app/login.tsx` e `app/home.tsx`
Estavam vazios. Agora apenas reexportam `screens/Login` e `screens/Home` (o expo-router exige um `export default` em cada arquivo de rota).

## Proteção das rotas

Já existia em `app/routes.tsx` e não foi alterado: `<Stack.Protected guard={!user}>` expõe `/login` só para deslogados, e `<Stack.Protected guard={Boolean(user && ...)}>` expõe `/home` só para logados. Como `signIn` e `signOut` mudam `user`, o redirecionamento acontece sozinho. O botão de logout do `Header` (`logout()` + `refreshUser()`) funciona sem alteração.

## Como rodar

1. Back-end atualizado (`git pull origin main`), banco e API rodando, usuário de teste criado.
2. No mobile: `npm install`, copiar `.env.example` para `.env` e definir `EXPO_PUBLIC_BASE_URL`:
   - celular físico: `http://<IP-do-PC>:3000` (mesma rede Wi-Fi)
   - emulador Android: `http://10.0.2.2:3000`
   - navegador (web): `http://localhost:3000`
3. `npx expo start -c` e abrir no **Expo Go** (não pela câmera comum).
4. Liberar a porta 3000 no Firewall do Windows se aparecer `Network Error`.
5. Só para teste **na web**: o CORS do back-end precisa liberar a origem do Expo. No `.env` do back-end, `FRONTEND_URL=http://localhost:8081` (ou a porta que o Expo usar). No celular o CORS não se aplica.

## Testes manuais

- [ ] Login com usuário válido leva à Home.
- [ ] Botão de logout do Header volta para o login.
- [ ] Fechar e reabrir o app mantém a sessão (cookie).
- [ ] Senha errada exibe "Matrícula ou senha inválidas".

## Limitações conhecidas

- Sem refresh token: quando o cookie expira (`AUTH_COOKIE_MAX_AGE_MS`, padrão 1 hora), o próximo `getMe` falha e o usuário volta ao login.
- O visual do login é mais simples que o da web (sem imagem de fundo, ícones e animação).
- Em produção o back-end usa `secure` e `sameSite: none` no cookie (`IS_PRODUCTION=true`), o que exige HTTPS.
