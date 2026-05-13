import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import forgotPasswordReducer from './forgotPasswordSlice';

export const store = configureStore({
    reducer: {
        profile: profileReducer,
         forgotPassword: forgotPasswordReducer,
    }
});

export default store;
