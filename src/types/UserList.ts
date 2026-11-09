import { User } from './User';

export type UserListResponse = {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageLength: number;
    totalItems: number;
  };
};
