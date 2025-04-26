"use client";

import { useMutation } from '@tanstack/react-query';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setUser, clearUser } from '@/redux/slices/userSlice';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import usePostData from './usePostData';

export const useSignUp = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    },
    onSuccess: (user) => {
      dispatch(setUser({
        email: user.email!,
        uid: user.uid,
      }));
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });
};

export const useSignIn = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    },
    onSuccess: (user) => {
      dispatch(setUser({
        email: user.email!,
        uid: user.uid,
      }));
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });
};

export const useSignOut = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      dispatch(clearUser());
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user as { user: any; isAuthenticated: boolean });
  const accessToken = getCookie('accessToken');

  const { mutate: fetchUser } = usePostData('/auth/me', {
    onSuccess: (data) => {
      dispatch(setUser(data));
    },
    onError: () => {
      dispatch(clearUser());
      deleteCookie('accessToken');
    },
  });

  useEffect(() => {
    if (accessToken && !isAuthenticated) {
      fetchUser({});
    }
  }, [accessToken, isAuthenticated]);

  const login = (userData: any) => {
    // Also store in localStorage for backward compatibility
    localStorage.setItem('userData', JSON.stringify(userData));
    // Update Redux state
    dispatch(setUser(userData));
  };

  const logout = () => {
    // Remove token from cookie
    deleteCookie('accessToken');
    
    // Also remove from localStorage for backward compatibility
    localStorage.removeItem('userData');
    
    // Clear Redux state
    dispatch(clearUser());
  };

  return {
    user,
    isAuthenticated,
    accessToken,
    login,
    logout,
  };
}; 
