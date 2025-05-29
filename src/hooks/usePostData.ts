"use client";

import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { postData } from '@/services/apiService';
import { useRouter } from 'next/navigation';

interface UsePostDataOptions<TData, TError, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: TError, variables: TVariables) => void | Promise<void>;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void | Promise<void>;
}

const usePostData = <TData, TError = Error, TVariables = any>(
  endpoint: string,
  options?: UsePostDataOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> & { isLoading: boolean } => {
  const router = useRouter();

  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      try {
        const response = await postData(endpoint, variables);
        return response as TData;
      } catch (error: any) {
        if (error?.response?.status === 401 && typeof window !== 'undefined') {
          router.push('/auth/login');
        }
        throw error;
      }
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onSettled: options?.onSettled,
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export default usePostData; 