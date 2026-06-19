import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiRequest } from "../../../config/apiHelper";

const API_URL = "/api/users";

const saveUser = (user, token) => {
  const userWithToken = { ...user, token };
  localStorage.setItem("user", JSON.stringify(userWithToken));
  return userWithToken;
};
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      await apiRequest(`${API_URL}/register`, { method: "POST", body: formData });
      return { email: formData.email };
    } catch (error) {
      toast.error(error.message || "Register Failed");
      return rejectWithValue(error.message || "Register Failed");
    }
  }
);
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otpCode }, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_URL}/verify-otp`, {
        method: "POST",
        body: { email, otpCode },
      });
      return data;
    } catch (error) {
      toast.error(error.message || "OTP Verification Failed");
      return rejectWithValue(error.message || "OTP Verification Failed");
    }
  }
);
export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async ({ email }, { rejectWithValue }) => {
    try {
      await apiRequest(`${API_URL}/resend-otp`, { method: "POST", body: { email } });
      return { email };
    } catch (error) {
      toast.error(error.message || "Resend OTP Failed");
      return rejectWithValue(error.message || "Resend OTP Failed");
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_URL}/login`, { method: "POST", body: formData });
      return data;
    } catch (error) {
      toast.error(error.message || "Login Failed");
      return rejectWithValue(error.message || "Login Failed");
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (formData, { rejectWithValue }) => {
    try {
      await apiRequest(`${API_URL}/forgot-password`, { method: "POST", body: formData });
      return { email: formData.email };
    } catch (error) {
      toast.error(error.message || "Forgot Password Error");
      return rejectWithValue(error.message || "Forgot Password Error");
    }
  }
);
export const verifyResetOTP = createAsyncThunk(
  "auth/verifyResetOTP",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_URL}/verify-reset-otp`, {
        method: "POST",
        body: formData,
      });
      return { resetToken: data.resetToken };
    } catch (error) {
      toast.error(error.message || "Verify Reset OTP Error");
      return rejectWithValue(error.message || "Verify Reset OTP Error");
    }
  }
);
export const resendResetOTP = createAsyncThunk(
  "auth/resendResetOTP",
  async ({ email }, { rejectWithValue }) => {
    try {
      await apiRequest(`${API_URL}/resend-reset-otp`, { method: "POST", body: { email } });
      return { email };
    } catch (error) {
      toast.error(error.message || "Resend OTP Failed");
      return rejectWithValue(error.message || "Resend OTP Failed");
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const { email, password, confirmPassword } = formData;
      await apiRequest(`${API_URL}/reset-password`, {
        method: "POST",
        body: { email, newPassword: password, confirmPassword },
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Reset Password Error");
      return rejectWithValue(error.message || "Reset Password Error");
    }
  }
);
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiRequest(`${API_URL}/logout`, { method: "POST" });
      toast.success("User Logged Out Successfully");
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Logout Failed");
      return rejectWithValue(error.message || "Logout Failed");
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
        state.user = saveUser(action.payload.user, action.payload.token);
        state.email = null;
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
        state.email = action.payload.email;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendResetOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendResetOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendResetOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = saveUser(action.payload.user, action.payload.token);
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
        state.email = action.meta.arg.email;
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
