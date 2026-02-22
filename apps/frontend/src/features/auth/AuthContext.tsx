import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../../shared/types';

interface AuthContextValue {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    loginAsVisitor: (name: string, email: string) => void;
    logout: () => void;
    isOwner: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Demo credentials
const OWNER_CREDENTIALS = { email: 'admin@coleccion.com', password: 'admin123' };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const stored = sessionStorage.getItem('coleccion_user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email: string, password: string): Promise<boolean> => {
        await new Promise(r => setTimeout(r, 600));
        if (
            email.toLowerCase() === OWNER_CREDENTIALS.email &&
            password === OWNER_CREDENTIALS.password
        ) {
            const owner: User = {
                id: 'user-1',
                name: 'Coleccionista',
                email,
                role: 'owner',
            };
            setUser(owner);
            sessionStorage.setItem('coleccion_user', JSON.stringify(owner));
            return true;
        }
        return false;
    };

    const loginAsVisitor = (name: string, email: string) => {
        const visitor: User = {
            id: 'user-visitor',
            name,
            email,
            role: 'visitor',
        };
        setUser(visitor);
        sessionStorage.setItem('coleccion_user', JSON.stringify(visitor));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('coleccion_user');
    };

    return (
        <AuthContext.Provider
            value={{ user, login, loginAsVisitor, logout, isOwner: user?.role === 'owner' }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
