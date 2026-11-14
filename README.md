# Edify — Mobile

Aplicativo educacional desenvolvido para o Tech Challenge da Fase 4. O Edify conecta professores e alunos da rede pública, facilitando o acesso às aulas e a organização dos usuários da escola.

A interface foi desenvolvida em React Native, seguindo o protótipo do grupo e utilizando o back-end das fases anteriores.

## Problema

Professores e alunos precisam de um espaço para compartilhar e consultar aulas pelos seus tablets e celulares. Também é necessário organizar os usuários e definir quais ações cada perfil pode realizar.

## Solução

O aplicativo leva o Edify para o ambiente mobile, com acesso por perfil e integração com a API. A aplicação possui login, proteção de rotas por perfil, busca de posts, visualização de aulas, gerenciamento de usuários e uma interface adaptada a diferentes tamanhos de tela. Além disso, o aplicativo é compatível tanto com o sistema Android quanto o iOS.

## Funcionalidades

- Login por matrícula e senha.
- Sessão de autenticação mantida por token JWT enviado pelo back-end e armazenado com `SecureStore`.
- Recuperação do usuário autenticado por meio do endpoint `/user/me`.
- Proteção de rotas e autorização por perfil: ADMIN, PROFESSOR e ALUNO.
- Página inicial com foto de perfil do usuário, aulas e lista resumida de usuários.
- Busca de aulas por texto, com atraso de 300 ms (debounce) para reduzir requisições durante a digitação.
- Exibição de aulas novas em carrossel.
- Listagem de aulas visualizadas e gerenciamento de posts conforme o perfil.
- Listagem completa de usuários, agrupada por tipo de acesso.
- Cadastro e edição de usuários com nome, matrícula, data de nascimento, senha, perfil e imagem.
- Upload e pré-visualização de foto de usuário nos formatos PNG e JPEG.
- Exclusão de usuários e posts com confirmação por modal.
- Interface responsiva para tablets e celulares Android e iOS.
- Mensagens de sucesso e erro para operações de usuário e tratamento padronizado de erros da API.

## Regras de acesso autorizadas pelos professores

O grupo consultou os professores sobre manter na Fase 4 as regras de negócio implementadas na Fase 2, mesmo com a redação dos requisitos 5, 6 e 7 sobre gestão de professores. [A manutenção foi autorizada](https://discord.com/channels/1179103166873223259/1458246637750321232/threads/1552403004240560299) com a condição de registrar a decisão no README:

> Se já estiver dessa forma, pode manter, deixa isso explicito na documentação do Readme para eu não esquecer quando for corrigir (Ou outro professor). - Prof. Gustavo Scarpim

| Perfil | Posts | Gestão de usuários |
| --- | --- | --- |
| `ADMIN` | Cria, consulta, edita e exclui qualquer post. | Cadastra, consulta, edita e exclui alunos, professores e administradores. |
| `PROFESSOR` | Consulta e cria posts; edita e exclui somente os próprios posts. | Cadastra e atualiza alunos. Não pode excluir alunos nem gerenciar professores ou administradores. |
| `ALUNO` | Consulta os posts. | Não gerencia usuários. |

Assim, o gerenciamento de professores e a exclusão de alunos ficam sob responsabilidade do administrador. Os demais requisitos da Fase 4 continuam aplicáveis.

Na tela de cadastro, professores têm apenas o perfil **Aluno**, sem possibilidade de alteração. Administradores podem escolher entre **Aluno**, **Professor** e **Administrador**.

## Tecnologias

- React Native e Expo
- React e TypeScript
- Expo Router
- Context API
- Axios
- StyleSheet e styled-components
- Swiper Flatlist
- Expo ImagePicker para seleção de fotos
- Google Material Symbols e Google Fonts
- Jest e Testing Library

## Arquitetura

O projeto está organizado em telas, componentes e serviços. As telas cuidam da interação com o usuário, os componentes reúnem elementos reutilizáveis e os serviços fazem a comunicação com a API.

```text
assets/          Imagens, fontes e ícones
src/
  app/           Rotas e layout principal
  navigation/    Controle do acesso às rotas
  screens/       Telas do aplicativo
  components/    Componentes compartilhados
  context/       Informações da sessão
  services/      Comunicação com o back-end
  styles/        Tema e estilos globais
  types/         Tipos compartilhados
  hooks/         Hooks auxiliares
  utils/         Funções auxiliares
  __tests__/     Testes automatizados
  __mocks__/     Mocks utilizados em testes
```

## Como rodar

### Pré-requisitos

- Node.js e npm. O desenvolvimento foi realizado com Node.js 24.
- Back-end configurado e em execução. [Veja aqui como configurar](https://github.com/david-pessoa/tech-challenge-backend).
- Navegador, celular ou emulador com ambiente compatível com a versão do Expo utilizada.

### Instalação

Dentro da pasta do projeto, execute:

```bash
npm install
cp .env.example .env
```

O `npm install` instala todas as dependências necessárias, incluindo os pacotes de fotos, fontes, ícones e testes.

### Variáveis de ambiente
O front-end usa EXPO_PUBLIC_BASE_URL para montar as chamadas à API e as URLs das imagens. No arquivo `.env`, informe o endereço do back-end:

```env
EXPO_PUBLIC_BASE_URL=http://localhost:3000
```

O aplicativo acrescenta `/api` ao endereço automaticamente. Para testar em um aparelho físico ou emulador, substitua `localhost` pelo IP do computador.
Depois, insira no arquivo `.env` do projeto do back-end a URL do projeto front-end. [Veja aqui como fazer isso](https://github.com/david-pessoa/tech-challenge-backend#variáveis-de-ambiente).

### Inicie o aplicativo

```bash
npm run start
```

Pressione **`w`** para abrir no navegador ou **`a`** para abrir no emulador Android configurado. Para utilizar o QR code no celular, use uma versão do Expo compatível com o projeto.

### Arquivo `.pkg` disponível
A versão do aplicativo para Android está disponível e pode ser obtida fazendo o download do arquivo `application-android.apk` num dispositivo android. [Clique aqui para obter o arquivo](https://github.com/david-pessoa/tech-challenge-mobile/application-android.apk)

### Back-end

Para rodar a aplicação no modo desenvolvimento, rode apenas
```bash
npm run dev
```

Na pasta do back-end, após configurar o `.env`, execute o seguinte comando para rodar com Docker no modo produção:

```bash
docker compose up -d --build
```

As instruções completas estão no [repositório do back-end](https://github.com/david-pessoa/tech-challenge-backend). A documentação dos endpoints fica em `http://localhost:3000/docs`.

### Outros comandos

```bash
npx expo start --clear
npx tsc --noEmit
npm test -- --runInBand
```

Os comandos acima reiniciam o Expo com o cache limpo, verificam os tipos e executam os testes, respectivamente.

## Decisões técnicas

- **Expo e React Native multiplataforma:** a aplicação usa Expo, React Native e React Native Web para compartilhar a maior parte do código entre Android, iOS e navegador. Quando necessário, há implementações específicas por plataforma, como o calendário web e o tratamento de imagens selecionadas.

- **Navegação baseada em arquivos:** o Expo Router organiza as telas em `src/app`. O arquivo `src/navigation/routes.tsx` concentra os `Stack.Protected`, impedindo que usuários sem sessão ou sem o perfil adequado acessem as rotas protegidas.

- **Autenticação centralizada:** o `AuthContext` é a única camada responsável por restaurar a sessão, carregar `/user/me`, realizar login e disponibilizar o usuário atual para as telas. O JWT é salvo no `SecureStore`, e o Axios adiciona o token automaticamente nas requisições.

- **Serviços separados da interface:** as chamadas para autenticação, usuários e posts ficam em `src/services`, enquanto telas e componentes cuidam da apresentação e da interação. Isso facilita a reutilização e permite testar a interface com os serviços simulados.

- **Cliente HTTP e erros padronizados:** uma instância única do Axios define a URL base e o envio das credenciais. As operações convertem respostas de erro da API em mensagens compreensíveis para exibição ao usuário.

- **Autorização por perfil em duas camadas:** as rotas e a interface ocultam ou bloqueiam ações conforme `ADMIN`, `PROFESSOR` e `ALUNO`, enquanto a API permanece responsável pela validação definitiva das permissões.

- **Formulários com `FormData`:** o cadastro e a edição de usuários e posts enviam texto e imagens em uma única requisição multipart. A seleção e a pré-visualização das imagens são feitas com `expo-image-picker`.

- **Responsividade e identidade visual compartilhada:** estilos globais, tema do `styled-components`, fontes Poppins e o hook `useWindowDimensions()` são usados para adaptar os componentes a celulares e tablets, mantendo cores, tipografia e espaçamentos consistentes.

- **Paginação do conteúdo obtido através de GET /api/user:** utiliza-se apenas uma rota para obter todos os usuários da aplicação, que podem ser filtrados por role e serem paginados utilizando parâmetros de URL.

- **Testes orientados ao comportamento:** Jest e Testing Library verificam fluxos relevantes, como redirecionamento inicial, permissões, validação de formulários, paginação, exclusões, notificações e regras de data, com mocks para API, roteamento e recursos nativos.

## Melhorias futuras

- Ampliar a cobertura com testes de integração e E2E nos fluxos de login, criação/edição de posts, upload de imagens e navegação por perfil.
- Tratar globalmente respostas `401`, expiração do JWT e renovação de sessão, redirecionando o usuário para o login quando necessário.
- Cancelar ou ignorar respostas antigas da busca e avaliar cache local para reduzir chamadas repetidas à API.
- Implementar paginação, filtros e ordenação também para posts quando o volume de aulas crescer.
- Adicionar suporte a estados offline, retentativas controladas e uma experiência de carregamento mais uniforme nas telas.
- Reduzir o tamanho das imagens antes do upload, com compressão, recorte e validação de dimensões além da validação de formato.
- Fazer uma auditoria de acessibilidade em Android, iOS e web, incluindo navegação por teclado, contraste, foco e leitores de tela.
- Validar as variáveis de ambiente na inicialização e separar configurações de desenvolvimento, homologação e produção.
- Adicionar monitoramento de erros e métricas de uso para acompanhar falhas de rede e os principais fluxos do aplicativo.
