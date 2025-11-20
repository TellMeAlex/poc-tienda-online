import { configureStore } from '@reduxjs/toolkit';
import { airisApi } from './services/airisApi';
import { airisLoaderApi } from './services/airisLoaderApi';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [airisApi.reducerPath]: airisApi.reducer,
    [airisLoaderApi.reducerPath]: airisLoaderApi.reducer,
    
    // Regular slices
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      airisApi.middleware,
      airisLoaderApi.middleware
    ),
});
