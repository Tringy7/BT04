import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { Spin } from 'antd';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { auth, appLoading } = useContext(AuthContext);
    const location = useLocation();

    if (appLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }


    if (!auth.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(auth.user.role)) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;