import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateUserProfileApi, updateAdminProfileApi, getUserProfileApi } from '../components/util/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getUserProfileApi();
            if (data && data.user) return data.user;
            return rejectWithValue(data?.message || 'Failed to fetch profile');
        } catch (error) {
            return rejectWithValue(error?.message || 'Failed to fetch profile');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'profile/updateUserProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const data = await updateUserProfileApi(profileData);
            if (data && data.user) return data.user;
            return rejectWithValue(data?.message || 'Failed to update profile');
        } catch (error) {
            return rejectWithValue(error?.message || 'Failed to update profile');
        }
    }
);

export const updateAdminProfile = createAsyncThunk(
    'profile/updateAdminProfile',
    async ({ userId, profileData }, { rejectWithValue }) => {
        try {
            const data = await updateAdminProfileApi(userId, profileData);
            if (data && data.user) return data.user;
            return rejectWithValue(data?.message || 'Failed to update profile');
        } catch (error) {
            return rejectWithValue(error?.message || 'Failed to update profile');
        }
    }
);

const initialState = {
    profile: {
        id: null,
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        gender: '',
        image: '',
        positionId: null,
        role: ''
    },
    loading: false,
    error: null,
    success: false
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        resetProfile: (state) => {
            state.profile = initialState.profile;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        // Fetch User Profile
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update User Profile
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.success = true;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });

        // Update Admin Profile
        builder
            .addCase(updateAdminProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateAdminProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.success = true;
            })
            .addCase(updateAdminProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    }
});

export const { clearError, clearSuccess, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
