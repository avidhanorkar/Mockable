import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}