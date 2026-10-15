import type { Role } from "./Roles";

export type Post = {
  postId: string;
  userId?: string | null;
  materia: string;
  titulo: string;
  descricao: string;
  conteudo?: string;
  foiVisto?: boolean;
  autor: string;
  image?: string | null;
  subject?: {
    id: string;
    nome: string;
  };
  criadoPor?: {
    userId: string;
    nome: string;
    tipoUsuario: Role;
    image: string | null;
  };
  createdAt: Date;
  editedAt: Date;
  dataCriacao?: Date;
  dataModificacao?: Date;
};