import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, updateAdminProfile, clearError, clearSuccess } from '../redux/profileSlice';
import { useCallback } from 'react';

export const useProfile = () => {
    const dispatch = useDispatch();
    const { profile, loading, error, success } = useSelector(state => state.profile);

    const handleFetchProfile = useCallback(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const handleUpdateUserProfile = useCallback((profileData) => {
        dispatch(updateUserProfile(profileData));
    }, [dispatch]);

    const handleUpdateAdminProfile = useCallback((userId, profileData) => {
        dispatch(updateAdminProfile({ userId, profileData }));
    }, [dispatch]);

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleClearSuccess = useCallback(() => {
        dispatch(clearSuccess());
    }, [dispatch]);

    return {
        profile,
        loading,
        error,
        success,
        fetchProfile: handleFetchProfile,
        updateUserProfile: handleUpdateUserProfile,
        updateAdminProfile: handleUpdateAdminProfile,
        clearError: handleClearError,
        clearSuccess: handleClearSuccess
    };
};
