// src/routes/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function PublicRoute({ children }: {children: React.ReactNode}) {
    const { user, } = useAuth()
    return user ? <Navigate to="/dashboard" replace /> : children;
}
