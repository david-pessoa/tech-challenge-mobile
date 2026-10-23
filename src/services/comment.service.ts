import { api } from './api';
import { getBackendErrorMessage } from './auth.service';
import type { Comment } from '../types/Comment';


export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const response = await api.get(`/post/comment/list/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar comentários do post ${postId}:`, error);
    return [];
  }
}

export async function updateComment(id: string, conteudo: string): Promise<void> {
  try {
    await api.patch(`/post/comment/${id}`, { conteudo });
  } catch (error) {
    console.error(`Erro ao atualizar comentário ${id}:`, error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function createComment(
  postId: string,
  comentario: string,
  parentCommentId?: string
): Promise<void> {
  try {
    const payload = parentCommentId
      ? { conteudo: comentario, parentCommentId }
      : { conteudo: comentario };

    await api.post(`/post/comment/${postId}`, payload);
  } catch (error) {
    console.error(`Erro ao enviar comentário no post ${postId}:`, error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function deleteComment(id: string): Promise<void> {
  try {
    await api.delete(`/post/comment/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar comentário ${id}:`, error);
    throw new Error(getBackendErrorMessage(error));
  }
}
