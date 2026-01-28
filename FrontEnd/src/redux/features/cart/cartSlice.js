import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      const existingItem = state.products.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
        state.quantity += 1;
      }
      state.total += action.payload.price * action.payload.quantity;
    },

    removeProduct: (state, action) => {
      const index = state.products.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        const item = state.products[index];
        state.total -= item.price * item.quantity;
        state.products.splice(index, 1);
        state.quantity -= 1;
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (product) => product.id === action.payload.id
      );
      if (item) {
        item.quantity += 1;
        state.total += item.price;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.products.find(
        (product) => product.id === action.payload.id
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.total -= item.price;
      } else if (item && item.quantity === 1) {
        state.products = state.products.filter(
          (product) => product.id !== action.payload.id
        );
        state.quantity -= 1;
        state.total -= item.price;
      }
    },

    clearCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

export const {
  addProduct,
  removeProduct,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export const cartSliceReducer = cartSlice.reducer;