import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, size, color } = action.payload;
      
      // Check if item already exists with same size and color
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.product_id === product.product_id &&
          item.size === size &&
          item.color === color
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          product,
          quantity,
          size,
          color,
        });
      }
    },

    removeFromCart: (state, action) => {
      const { productId, size, color } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(
            item.product.product_id === productId &&
            item.size === size &&
            item.color === color
          )
      );
    },

    updateQuantity: (state, action) => {
      const { productId, quantity, size, color } = action.payload;
      const item = state.items.find(
        (item) =>
          item.product.product_id === productId &&
          item.size === size &&
          item.color === color
      );
      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.product.product_price * item.quantity,
    0
  );

export const selectCartItemsCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
