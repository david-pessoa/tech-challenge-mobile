import { api } from './api';
import { getBackendErrorMessage } from './auth.service';

export async function getAllUsers() {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Erro na obtenção de lista de usuários:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function getUserById(id: string) {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro na obtenção de dados do usuário:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function createUser(user: FormData) {
  try {
    const response = await api.post('/user', user);
    return response.data;
  } catch (error) {
    console.error('Erro na criação de usuário:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function updateUser(id: string, user: FormData) {
  try {
    const response = await api.patch(`/user/${id}`, user);
    return response.data;
  } catch (error) {
    console.error('Erro na atualização de usuários:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function deleteUser(id: string) {
  try {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro na remoção de usuários:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function getMe() {
  try {
    const response = await api.get('/user/me');
    return response.data;
  } catch (error) {
    console.error('Erro na obtenção de dados do usuário logado:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}
