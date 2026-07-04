import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()

    if (user) {
        const hasApiKey = localStorage.getItem('gemini_api_key');
        if (!hasApiKey) {
            return <Navigate to="/api-setup" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}