# Edify — Mobile

Aplicativo educacional desenvolvido para o Tech Challenge da Fase 4. O Edify conecta professores e alunos da rede pública, facilitando o acesso às aulas e a organização dos usuários da escola.

A interface foi desenvolvida em React Native, seguindo o protótipo do grupo e utilizando o back-end das fases anteriores.

## Problema

Professores e alunos precisam de um espaço para compartilhar e consultar aulas pelo celular. Também é necessário organizar os usuários e definir quais ações cada perfil pode realizar.

## Solução

O aplicativo leva o Edify para o ambiente mobile, com acesso por perfil e integração com a API. O desenvolvimento está em andamento: a tela de cadastro de usuários está implementada, enquanto o login e as demais telas ainda precisam ser concluídos e integrados.

## Funcionalidades do cadastro

- Cadastro de usuários por administradores e professores.
- Campos para nome completo, data de nascimento, perfil, matrícula e senha.
- Seleção, prévia, troca e remoção da foto do usuário.
- Envio da foto junto com os dados para o servidor.
- Campos obrigatórios identificados com asterisco vermelho.
- Mensagens de validação abaixo dos campos.
- Validação de senha e confirmação ao sair dos campos.
- Opção para mostrar ou ocultar as senhas.
- Avisos de sucesso e erro após o envio.
- Limpeza dos campos e da foto após o cadastro bem-sucedido.

## Regras de acesso autorizadas pelos professores

O grupo consultou os professores sobre manter na Fase 4 as regras de negócio implementadas na Fase 2, mesmo com a redação dos requisitos 5, 6 e 7 sobre gestão de professores. A manutenção foi autorizada com a condição de registrar a decisão no README:

> Se já estiver dessa forma, pode manter, deixa isso explicito na documentação do Readme para eu não esquecer quando for corrigir (Ou outro professor).

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
- Expo ImagePicker para seleção de fotos
- Expo Font e React Native SVG para fontes e ícones
- Jest e Testing Library

## Arquitetura

O projeto está organizado em telas, componentes e serviços. As telas cuidam da interação com o usuário, os componentes reúnem elementos reutilizáveis e os serviços fazem a comunicação com a API.

```text
assets/          Imagens, fontes e ícones
src/
  app/           Rotas e layout principal
  screens/       Telas do aplicativo
  components/    Componentes compartilhados
  context/       Informações da sessão
  services/      Comunicação com o back-end
  styles/        Tema e estilos globais
  types/         Tipos compartilhados
  hooks/         Hooks auxiliares
  utils/         Funções auxiliares
  __tests__/     Testes automatizados
```

## Como rodar

### Pré-requisitos

- Node.js e npm. O desenvolvimento foi realizado com Node.js 24.
- Back-end configurado e em execução.
- Navegador, celular ou emulador com ambiente compatível com a versão do Expo utilizada.

### Instalação

Dentro da pasta do projeto, execute:

```bash
npm install
cp .env.example .env
```

O `npm install` instala todas as dependências necessárias, incluindo os pacotes de fotos, fontes, ícones e testes.

No arquivo `.env`, informe o endereço do back-end:

```env
EXPO_PUBLIC_BASE_URL=http://localhost:3000
```

O aplicativo acrescenta `/api` ao endereço automaticamente. Para testar em um aparelho físico ou emulador, substitua `localhost` pelo IP do computador.
Depois, insira no arquivo `.env` do projeto do back-end a URL do projeto front-end. [Veja aqui como fazer isso](https://github.com/david-pessoa/tech-challenge-backend#variáveis-de-ambiente).

> [!IMPORTANT]
> Ambos os dispositivos que estão rodando o back-end e o front-end em react native precisam estar na mesma rede local para que a integração funcione.


### Inicie o aplicativo

```bash
npm run start
```

Pressione **`w`** para abrir no navegador ou **`a`** para abrir no emulador Android configurado. Para utilizar o QR code no celular, use uma versão do Expo compatível com o projeto.

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

Para testar no navegador, o back-end precisa permitir a origem do Expo, normalmente `http://localhost:8081`, na configuração `FRONTEND_URL`.

### Outros comandos

```bash
npx expo start --clear
npx tsc --noEmit
npm test -- --runInBand
```

Os comandos acima reiniciam o Expo com o cache limpo, verificam os tipos e executam os testes, respectivamente.
