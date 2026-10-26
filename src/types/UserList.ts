import type { Role } from './Roles';

export type UserListItem = {
  id: string;
  nome: string;
  matricula: string;
  role: Role;
  birthDate: string | null;
  image: string | null;
};

export type UserListResponse = {
  users: UserListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageLength: number;
  };
};
