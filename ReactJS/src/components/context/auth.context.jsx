import { createContext, useReducer, useState, useEffect } from 'react';
import { getUserProfileApi } from '../util/api/user.api';

const initialAuthState = {
    isAuthenticated: false,
    user: {
        email: "",
        name: "",
        role: ""
    }
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                isAuthenticated: true,
                user: action.payload.user,
            };
        case 'LOGOUT':
            return initialAuthState;
        default:
            return state;
    }
};

export const AuthContext = createContext({
    auth: initialAuthState,
    dispatch: () => {},
    appLoading: true,
});

export const AuthWrapper = (props) => {
    const [auth, dispatch] = useReducer(authReducer, initialAuthState);
    const [appLoading, setAppLoading] = useState(true);

    useEffect(() => {
        const checkAuthOnLoad = async () => {
            try {
                // The httpOnly cookie is sent automatically by the browser.
                // We just need to call a protected endpoint to see if we get a valid user.
                const res = await getUserProfileApi();
                
                if (res && res.user) {
                    dispatch({
                        type: 'LOGIN',
                        payload: {
                            user: {
                                email: res.user.email,
                                name: res.user.firstName || res.user.name,
                                role: res.user.role,
                            }
                        }
                    });
                }
            } catch (error) {
                // If the API call fails (e.g., 401 Unauthorized), it means no valid cookie.
                // The axios interceptor might handle redirects, but we ensure the state is clean.
                dispatch({ type: 'LOGOUT' });
            } finally {
                setAppLoading(false);
            }
        };

        checkAuthOnLoad();
    }, []);

    return (
        <AuthContext.Provider value={{
            auth,
            dispatch,
            appLoading,
            setAppLoading,
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};