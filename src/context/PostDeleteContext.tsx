import { deletePost, getAllPosts } from '@/services/post.service';
import { Post } from '@/types/Posts';
import { useFocusEffect } from 'expo-router';
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState } from 'react';

type DeletePostContextType = {
  pendingDelete: Post | undefined;
  isDeleting: boolean;
  isLoading: boolean;
  notification:
    | {
        message: string;
        type: 'success' | 'error';
      }
    | undefined;
  postList: Post[] | undefined;
  requestDelete: (post: Post | undefined) => void;
  confirmDelete: () => Promise<void>;
  
};

export const DeletePostContext = createContext<DeletePostContextType>({
  pendingDelete: undefined,
  isDeleting: false,
  isLoading: true,
  notification: { message: '', type: 'error' },
  postList: undefined,
  requestDelete: () => {},
  confirmDelete: async () => {}
});

export function useDeletePost() {
  return useContext(DeletePostContext);
}

type DeletePostProviderProps = {
  children: ReactNode;
};

export function DeletePostProvider({ children }: DeletePostProviderProps) {
  const [pendingDelete, setPendingDelete] = useState<Post>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  }>();
  const [postList, setPostList] = useState<Post[]>([]);

  function requestDelete(post: Post | undefined) {
    if (isDeleting) return;
    setNotification(undefined);
    setPendingDelete(post);
  }

  async function confirmDelete() {
    if (!pendingDelete || isDeleting) return;
    const selectedPost = pendingDelete;
    setIsDeleting(true);
    try {
      await deletePost(selectedPost.postId);
      setPostList(prev => prev.filter(post => post.postId !== selectedPost.postId));
      setPendingDelete(undefined);
      setNotification({ message: 'Post excluído com sucesso!', type: 'success' });
    } catch (error) {
      setPendingDelete(undefined);
      setNotification({
        message: error instanceof Error ? error.message : 'Não foi possível excluir o post.',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setIsLoading(true);
      async function returnAllPosts() {
        try {
          const postsList = await getAllPosts();
          if (active) setPostList(postsList);
        } catch (error) {
          if (active) setPostList([]);
        }
        if (active) setIsLoading(false);
      }
      returnAllPosts();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <DeletePostContext.Provider
      value={{
        pendingDelete,
        isDeleting,
        isLoading,
        notification,
        postList,
        requestDelete,
        confirmDelete,
      }}
    >
      {children}
    </DeletePostContext.Provider>
  );
}
