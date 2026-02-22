import { authFetch } from '@/lib/authFetch';

export const getComments = async (ticketId: string) => {
  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/tickets/${ticketId}/comments`);

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return response?.json();
};

export const addComment = async (ticketId: string, content: string) => {
  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to add comment');
  }

  return response.json();
};


export const updateComment = async (commentId: string, content: string) => {
  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to update comment');
  }

  return response.json();
};


export const deleteComment = async (commentId: string) => {
  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
  });   


  if (!response.ok) {
    throw new Error('Failed to delete comment');
    }  
    return response.json();     }                                                                       