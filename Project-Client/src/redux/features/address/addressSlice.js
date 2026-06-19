import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../../config/apiHelper";

const API_URL = "/api/addresses";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest(API_URL);
      return data.addresses;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch addresses");
    }
  }
);

export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const data = await apiRequest(API_URL, { method: "POST", body: addressData });
      return data.address;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create address");
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete address");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((a) => a._id !== action.payload);
      });
  },
});

export const addressReducer = addressSlice.reducer;
