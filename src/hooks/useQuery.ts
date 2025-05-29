import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    posts: T[];
    pagination: PaginationMeta;
  };
}

export function usePaginatedQuery<T>(
  queryKey: string[],
  endpoint: string,
  params: PaginationParams = { page: 1, limit: 10 },
  options?: Omit<UseQueryOptions<ApiResponse<T>, Error>, 'queryKey' | 'queryFn'>
) {
  const router = useRouter();

  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<ApiResponse<T>>(endpoint, {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...params,
          },
        });
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch data');
        }
        
        return data;
      } catch (error: any) {
        if (error?.response?.status === 401 && typeof window !== 'undefined') {
          router.push('/auth/login');
        }
        throw error;
      }
    },
    ...options,
  });
}

// Example of a non-paginated GET request
export function useGenericQuery<T>(
  queryKey: string[],
  endpoint: string,
  params: Record<string, any> = {},
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  const router = useRouter();

  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<T>(endpoint, { params });
        return data;
      } catch (error: any) {
        if (error?.response?.status === 401 && typeof window !== 'undefined') {
          router.push('/auth/login');
        }
        throw error;
      }
    },
    ...options,
  });
} 