import type { Role } from './Roles';

export type User = {
  id: string;
  matricula: string;
  nome: string;
  role: Role;
  image?: string;
  birthDate?: Date
};
