import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    ownerOnly?: boolean;
}

export const ProtectedRoute = ({ children, ownerOnly = false }: ProtectedRouteProps) => {
    const { user, isOwner } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (ownerOnly && !isOwner) return <Navigate to="/" replace />;

    return <>{children}</>;
};
