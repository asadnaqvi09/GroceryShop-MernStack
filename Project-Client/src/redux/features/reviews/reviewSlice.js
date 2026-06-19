import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiRequest } from "../../../config/apiHelper";

const API_URL = "/api/reviews";

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_URL}/create`, { method: "POST", body: reviewData });
      toast.success("Review added successfully!");
      return data.review;
    } catch (error) {
      toast.error(error.message || "Failed to create review");
      return rejectWithValue(error.message || "Failed to create review");
    }
  }
);

export const getReviewsByProduct = createAsyncThunk(
  "reviews/getReviewsByProduct",
  async (productID, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_URL}/${productID}`);
      return data.reviews;
    } catch (error) {
      const message = error.message || "Failed to fetch reviews";
      if (!message.includes("No reviews")) toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewID, updatedData }, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_URL}/${reviewID}`, {
        method: "PUT",
        body: updatedData,
      });
      toast.success("Review updated successfully!");
      return data.review;
    } catch (error) {
      toast.error(error.message || "Failed to update review");
      return rejectWithValue(error.message || "Failed to update review");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewID, { rejectWithValue }) => {
    try {
      await apiRequest(`${API_URL}/${reviewID}`, { method: "DELETE" });
      toast.success("Review deleted successfully!");
      return reviewID;
    } catch (error) {
      toast.error(error.message || "Failed to delete review");
      return rejectWithValue(error.message || "Failed to delete review");
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
