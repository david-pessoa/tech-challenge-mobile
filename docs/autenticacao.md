# Autenticação no app mobile

Documento da implementação de **login, autenticação por token e Context API** no `tech-challenge-mobile` (Expo + React Native + TypeScript).

## Visão geral

O usuário informa matrícula e senha. O app chama `POST /api/auth/login`, recebe um **JWT** no corpo da resposta, guarda o token no aparelho e o envia em todas as requisições seguintes no header `Authorization: Bearer <token>`. O estado do usuário logado fica num **contexto React** (`UserContext`), que as telas e as rotas consultam.

```
Login (tela)
   └─ signIn(matricula, senha)            [AuthContext]
        ├─ login()  -> POST /auth/login   [auth.service]  -> { token, usuario }
        ├─ setToken(token)                [tokenStorage]  -> guarda no aparelho
        └─ refreshUser()
             └─ getMe() -> GET /user/me   [user.service]  (api.ts anexa o Bearer)
                  └─ setUser(...)  -> <Stack.Protected> libera /home
```

## Decisão importante: token no header, não cookie

O código original do mobile previa **cookie HttpOnly + refresh token + rota `/auth/logout`**. O back-end atual **não implementa nada disso**: ele devolve o JWT no JSON do login e não tem rota de logout. Por isso a implementação foi adaptada ao back-end existente:

| Antes (previsto) | Agora (implementado) |
| --- | --- |
| Cookie HttpOnly com `withCredentials` | Token no `Authorization: Bearer` via interceptor |
| `POST /auth/logout` | Logout local: apaga o token do aparelho |
| Usuário mockado no contexto | Usuário real via `GET /user/me` |

Se o back-end passar a usar cookies no futuro, só `api.ts`, `tokenStorage.ts` e o `signIn`/`signOut` precisam mudar.

## Arquivos criados e modificados

Todos em `src/`.

### `utils/tokenStorage.ts` (novo)
Guarda o token no aparelho. Expõe `getToken()`, `setToken(token)` e `clearToken()`.
- **Android/iOS:** `expo-secure-store` (armazenamento criptografado do sistema).
- **Web:** `localStorage` (só para testar no navegador).
- A chave é `edify.token`. O SecureStore **não aceita `:`** na chave, apenas letras, números, `.`, `-` e `_`.

### `services/api.ts` (modificado)
Instância do axios com `baseURL = EXPO_PUBLIC_BASE_URL + '/api'`. Removido o `withCredentials`. Adicionado um **interceptor de requisição** que lê o token e anexa `Authorization: Bearer <token>` em toda chamada.

### `services/auth.service.ts` (modificado)
- `login(matricula, password)`: chama `POST /auth/login` e devolve `{ message, token, usuario }`. Em caso de erro, lança `Error` com mensagem tratada.
- `logout()`: apaga o token local (o back-end não tem rota de logout).
- `getBackendErrorMessage(error)`: extrai a mensagem do back-end; devolve "Não foi possível conectar ao servidor." quando a requisição nem chega na API.

### `context/AuthContext.tsx` (modificado)
Contexto `UserContext` / `UserProvider` / hook `useUser()`.

| Valor | Descrição |
| --- | --- |
| `user` | Usuário logado (`undefined` = ninguém logado) |
| `isLoading` | `true` enquanto verifica se existe sessão salva |
| `userImageCacheKey` | Muda ao atualizar a foto, forçando recarregar a imagem |
| `refreshUser()` | Busca o usuário de novo (`GET /user/me`) |
| `signIn(matricula, senha)` | Faz login, guarda o token e carrega o usuário. Lança `Error` se falhar |
| `signOut()` | Apaga o token e zera o usuário |

Ao abrir o app, o provider chama `refreshUser()`: se há token válido, restaura a sessão; se não há (ou expirou), `user` fica `undefined`.

### `screens/Login/index.tsx` e `styles.ts` (modificados)
Tela de login: matrícula, senha com botão Mostrar/Ocultar, mensagem de erro, botão que desabilita durante o envio e validação de campos vazios. Não navega manualmente: quando `user` passa a existir, o `<Stack.Protected>` redireciona.

### `app/login.tsx` e `app/home.tsx` (modificados)
Estavam vazios. Agora apenas reexportam `screens/Login` e `screens/Home` (o expo-router exige um `export default` em cada arquivo de rota).

### `screens/Home/index.tsx` e `styles.ts` (modificados)
Home provisória: mostra "Olá, {nome}" e um botão **Sair**, para validar o fluxo login → home → logout.

### `package.json` / `package-lock.json`
Nova dependência: `expo-secure-store@~57.0.4`.

## Proteção das rotas

Já existia em `app/routes.tsx` e **não foi alterado**: `<Stack.Protected guard={!user}>` expõe `/login` só para deslogados, e `<Stack.Protected guard={Boolean(user && ...)}>` expõe `/home` só para logados. Como `signIn` e `signOut` mudam `user`, o redirecionamento acontece sozinho.

## Como rodar

1. Back-end rodando (`docker compose up -d postgres`, migrations e `npm run dev`) e usuário de teste criado.
2. No mobile: `npm install`, copiar `.env.example` para `.env` e definir `EXPO_PUBLIC_BASE_URL`:
   - celular físico: `http://<IP-do-PC>:3000` (mesma rede Wi-Fi)
   - emulador Android: `http://10.0.2.2:3000`
3. `npx expo start -c` e abrir no **Expo Go** (não pela câmera comum).
4. Liberar a porta 3000 no Firewall do Windows se aparecer `Network Error`.

## Testes manuais realizados e pendentes

- [x] Login com usuário válido leva à Home.
- [ ] Botão **Sair** volta para o login.
- [ ] Fechar e reabrir o app mantém a sessão.
- [ ] Senha errada exibe "Matrícula ou senha inválidas".

## Problemas encontrados durante o desenvolvimento

- **`Invalid key provided to SecureStore`:** a chave `edify:token` continha `:`. Corrigido para `edify.token`.
- **`Network Error` no login:** API fora do ar (Docker Desktop fechado). Verificar também IP no `.env` e Firewall.
- **`react-native-web`:** foi removido do projeto de propósito pelo time. Para testar no navegador, instalar com `--no-save`, sem alterar o `package.json`.

## Limitações conhecidas

- Não há refresh token: quando o JWT expira (`JWT_EXPIRES_IN`, padrão 1 dia), o próximo `getMe` falha e o usuário volta ao login.
- O logout não invalida o token no servidor; apenas o remove do aparelho.
- O visual é mais simples que o da web (sem imagem de fundo, ícones e animação).
- Há erros de tipo antigos no projeto (`theme` não tipado nos `styled-components`, `use-theme.ts`, `comment.service.ts`) que não fazem parte desta mudança.
