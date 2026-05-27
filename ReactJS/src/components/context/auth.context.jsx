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
                dispatch({ type: 'LOGOUT' });
            } finally {
                setAppLoading(false);
            }
        };

        checkAuthOnLoad();
    }, []);

    useEffect(() => {
        const handleForceLogout = () => {
            dispatch({ type: 'LOGOUT' });
        };

        window.addEventListener('force_logout', handleForceLogout);
        return () => window.removeEventListener('force_logout', handleForceLogout);
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