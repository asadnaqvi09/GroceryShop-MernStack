import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../../config/apiHelper";

const CART_URL = "/api/cart";

const calcTotals = (products) => {
  const quantity = products.length;
  const total = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { quantity, total };
};

const setCartState = (state, items) => {
  state.products = items;
  const { quantity, total } = calcTotals(items);
  state.quantity = quantity;
  state.total = total;
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    const user = getState().auth?.user;
    if (!user) return [];
    try {
      const data = await apiRequest(CART_URL);
      return data.items || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  }
);

export const addProduct = createAsyncThunk(
  "cart/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${CART_URL}/add`, {
        method: "POST",
        body: { productId: product._id, quantity: product.quantity || 1 },
      });
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add to cart");
    }
  }
);

export const removeProduct = createAsyncThunk(
  "cart/removeProduct",
  async (product, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${CART_URL}/${product._id}`, { method: "DELETE" });
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to remove item");
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (product, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${CART_URL}/${product._id}`, {
        method: "PUT",
        body: { quantity: product.quantity + 1 },
      });
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update quantity");
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (product, { rejectWithValue }) => {
    try {
      if (product.quantity <= 1) {
        const data = await apiRequest(`${CART_URL}/${product._id}`, { method: "DELETE" });
        return data.items;
      }
      const data = await apiRequest(`${CART_URL}/${product._id}`, {
        method: "PUT",
        body: { quantity: product.quantity - 1 },
      });
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update quantity");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue, getState }) => {
    const user = getState().auth?.user;
    if (user) {
      try {
        await apiRequest(CART_URL, { method: "DELETE" });
      } catch (error) {
        return rejectWithValue(error.message || "Failed to clear cart");
      }
    }
    return [];
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
    loading: false,
  },
  reducers: {
    resetCartLocal: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        setCartState(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        setCartState(state, action.payload);
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        setCartState(state, action.payload);
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        setCartState(state, action.payload);
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        setCartState(state, action.payload);
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        setCartState(state, action.payload);
      });
  },
});

export const { resetCartLocal } = cartSlice.actions;
export const cartSliceReducer = cartSlice.reducer;
