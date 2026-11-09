export type Comment = {
  id: string;
  childComment: {
    id: string;
    conteudo: string;
    dataCriacao: string;
    dataModificacao: string;
    image?: string | null;
  } | null;
  user: {
    id: string;
    nome: string;
  };
  conteudo: string;
  dataCriacao: string;
  dataModificacao: string;
  image?: string | null;
};
