export type Comment = {
  id: string;
  childComment: {
    id: string;
    conteudo: string;
    dataCriacao: string;
    dataModificacao: string;
    image?: string;
  } | null;
  user: {
    id: string;
    nome: string;
  };
  conteudo: string;
  dataCriacao: string;
  dataModificacao: string;
  image?: string; 
};