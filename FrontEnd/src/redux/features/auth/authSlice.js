import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = "http://localhost:4000/api/users";
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, formData, {
        withCredentials: true,
      });
      console.log(data.message);
      return { email: formData.email };
    } catch (error) {
      toast.error(error.response?.data?.message || "Register Failed");
      return rejectWithValue(error.response?.data?.message || "Register Failed");
    }
  }
);
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otpCode }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/verify-otp`,
        { email, otpCode },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP Verification Failed");
      return rejectWithValue(
        error.response?.data?.message || "OTP Verification Failed"
      );
    }
  }
);
export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/resend-otp`,
        { email },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Resend OTP Failed");
      return rejectWithValue(error.response?.data?.message || "Resend OTP Failed");
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, formData, {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
      return rejectWithValue(error.response?.data?.message || "Login Failed");
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/forgot-password`,
        formData,
        { withCredentials: true }
      );
      console.log(data.message);
      return { email: formData.email };
    } catch (error) {
      toast.error(error.response?.data?.message || "Forgot Password Error");
      return rejectWithValue(
        error.response?.data?.message || "Forgot Password Error"
      );
    }
  }
);
export const verifyResetOTP = createAsyncThunk(
  "auth/verifyResetOTP",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/verify-reset-otp`,
        formData,
        { withCredentials: true }
      );
      return { resetToken: data.resetToken };
    } catch (error) {
      toast.error(error.response?.data?.message || "Verify Reset OTP Error");
      return rejectWithValue(
        error.response?.data?.message || "Verify Reset OTP Error"
      );
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const { email, newPassword, confirmPassword } = formData;
      const response = await axios.post(`${API_URL}/reset-password`, {email,newPassword,confirmPassword}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset Password Error");
      return rejectWithValue(
        error.response?.data?.message || "Reset Password Error"
      );
    }
  }
);
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      toast.success("User Logged Out Successfully");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout Failed");
      return rejectWithValue(error.response?.data?.message || "Logout Failed");
    }
  }
);

let storedUser = null;
try {
  const userData = localStorage.getItem("user");
  storedUser = userData ? JSON.parse(userData) : null;
} catch (err) {
  console.error("Invalid user data in localStorage:", err);
  localStorage.removeItem("user");
}

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    loading: false,
    email: null,
    error: null,
    resetToken: null,
  },
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.email = action.payload.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.email = null;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.meta.arg.email;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyResetOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.resetToken = action.payload.resetToken;
      })
      .addCase(verifyResetOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.email = null;
        state.resetToken = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
      });
  },
});

export const { resetAuthError } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;