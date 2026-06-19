import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../../config/apiHelper";

const API_URL = "/api/orders";

const buildQuery = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val) params.append(key, val);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_URL}/my-orders`);
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  "order/fetchAdminOrders",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_URL}/admin/all${buildQuery(filters)}`);
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

export const fetchAdminStats = createAsyncThunk(
  "order/fetchAdminStats",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest(`${API_URL}/admin/stats`);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch stats");
    }
  }
);

export const verifyOrder = createAsyncThunk(
  "order/verifyOrder",
  async ({ orderId, action }, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_URL}/verify`, {
        method: "POST",
        body: { orderId, action },
      });
      return data.order;
    } catch (error) {
      return rejectWithValue(error.message || "Action failed");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    adminOrders: [],
    stats: null,
    loading: false,
    statsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state) => {
        state.statsLoading = false;
      })
      .addCase(verifyOrder.fulfilled, (state, action) => {
        state.adminOrders = state.adminOrders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      });
  },
});

export const orderReducer = orderSlice.reducer;
