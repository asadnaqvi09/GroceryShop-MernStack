import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:4000/api/reviews";
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth?.user?.token;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const { data } = await axios.post(`${API_URL}/create`, reviewData, config);
      toast.success("Review added successfully!");
      return data.review;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create review";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
export const getReviewsByProduct = createAsyncThunk(
  "reviews/getReviewsByProduct",
  async (productID, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/${productID}`);
      return data.reviews;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch reviews";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewID, updatedData }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth?.user?.token;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const { data } = await axios.put(
        `${API_URL}/${reviewID}`,
        updatedData,
        config
      );
      toast.success("Review updated successfully!");
      return data.review;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update review";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewID, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth?.user?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      await axios.delete(`${API_URL}/${reviewID}`, config);
      toast.success("Review deleted successfully!");
      return reviewID;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete review";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getReviewsByProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export const reviewReducer = reviewSlice.reducer;