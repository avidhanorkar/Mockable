import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { API_BASE_URL } from '../config/api';

export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, user: any) => void;
    logout: () => void;
}

export interface LoginResponse {
    msg: string;
    token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                const rawUser = userData.user;
                if (rawUser) {
                    setUser({
                        id: rawUser._id || rawUser.id,
                        email: rawUser.email,
                        name: rawUser.name
                    });
                }
            }

        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedToken = localStorage.getItem('auth-token');

                if (storedToken) {
                    setToken(storedToken);
                    await fetchUserData();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (newToken: string, newUser: any) => {
        setToken(newToken);
        if (newUser) {
            setUser({
                id: newUser._id || newUser.id,
                email: newUser.email,
                name: newUser.name
            });
        } else {
            setUser(null);
        }
        localStorage.setItem('auth-token', newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth-token');
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};