import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forgotPasswordApi, resetPasswordApi, resendForgotOtpApi } from '../components/util/api';

export const requestForgotPassword = createAsyncThunk(
    'forgotPassword/requestForgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const data = await forgotPasswordApi(email);
            if (data && data.tempToken) {
                return {
                    email,
                    tempToken: data.tempToken,
                    message: data.message || 'OTP sent',
                };
            }
            return rejectWithValue(data?.message || 'Gửi OTP thất bại');
        } catch (error) {
            return rejectWithValue(error?.message || 'Gửi OTP thất bại');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'forgotPassword/resetPassword',
    async ({ email, otp, tempToken, newPassword, confirmPassword }, { rejectWithValue }) => {
        try {
            const data = await resetPasswordApi(email, otp, tempToken, newPassword, confirmPassword);
            if (data && data.message) {
                return {
                    message: data.message,
                };
            }
            return rejectWithValue(data?.message || 'Đặt lại mật khẩu thất bại');
        } catch (error) {
            return rejectWithValue(error?.message || 'Đặt lại mật khẩu thất bại');
        }
    }
);

export const resendForgotOtp = createAsyncThunk(
    'forgotPassword/resendForgotOtp',
    async (email, { rejectWithValue }) => {
        try {
            const data = await resendForgotOtpApi(email);
            if (data && data.message) {
                return {
                    message: data.message,
                };
            }
            return rejectWithValue(data?.message || 'Gửi lại OTP thất bại');
        } catch (error) {
            return rejectWithValue(error?.message || 'Gửi lại OTP thất bại');
        }
    }
);

const initialState = {
    step: 1,
    email: '',
    tempToken: '',
    loading: false,
    resendLoading: false,
    error: null,
    successMessage: null,
};

const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState,
    reducers: {
        resetForgotPasswordState: (state) => {
            state.step = 1;
            state.email = '';
            state.tempToken = '';
            state.loading = false;
            state.resendLoading = false;
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(requestForgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(requestForgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.step = 2;
                state.email = action.payload.email;
                state.tempToken = action.payload.tempToken;
                state.successMessage = action.payload.message;
            })
            .addCase(requestForgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resendForgotOtp.pending, (state) => {
                state.resendLoading = true;
                state.error = null;
            })
            .addCase(resendForgotOtp.fulfilled, (state, action) => {
                state.resendLoading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(resendForgotOtp.rejected, (state, action) => {
                state.resendLoading = false;
                state.error = action.payload;
            });
    },
});

export const { resetForgotPasswordState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
