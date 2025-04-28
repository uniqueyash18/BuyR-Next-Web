import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
  isAuthenticated: boolean;
  error: string | null;
}

// Load initial state from localStorage if available
const loadState = (): UserState => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('userData');
    if (savedState) {
      return JSON.parse(savedState);
    }
  }
  return {
    user: null,
    isAuthenticated: false,
    error: null,
  };
};

const initialState: UserState = loadState();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(state));
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setError } = userSlice.actions;
export default userSlice.reducer; 