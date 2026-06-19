import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../../config/apiHelper";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/api/products");
      return data.products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/api/products/category/${category}`);
      return data.products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const searchProducts = createAsyncThunk(
  "products/search",
  async (query, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/api/products/search?q=${encodeURIComponent(query)}`);
      return data.products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    searchResults: [],
    loading: false,
    searchLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  },
});

export const productReducer = productSlice.reducer;
