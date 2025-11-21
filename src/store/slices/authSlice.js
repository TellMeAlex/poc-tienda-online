import { createSlice } from '@reduxjs/toolkit';
import { airisApi } from '../services/airisApi';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Load from sessionStorage if available
const loadAuthFromStorage = () => {
  try {
    const storedAuth = sessionStorage.getItem('auth');
    if (storedAuth) {
      return JSON.parse(storedAuth);
    }
  } catch (error) {
    console.error('Error loading auth from storage:', error);
  }
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthFromStorage(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Persist to sessionStorage
      sessionStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear sessionStorage
      sessionStorage.removeItem('auth');
    },
  },
  extraReducers: (builder) => {
    // Reset API cache on logout
    builder.addCase('auth/logout', (state) => {
      airisApi.util.resetApiState();
    });
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
